import * as OrderRepository from "../repositories/orders-repository";
import * as InventoryRepository from "../repositories/inventories-repository";
import * as UnitRepository from "../repositories/units-repository";
import * as MenuRepository from "../repositories/menus-repository";
import * as PaymentRepository from "../repositories/payments-repository";
import { createErrorMessage } from "../utils/error-message";

export const getAllOrdersByUnitIdService = async (unidade_id: string) => {
    try {
        const result = await OrderRepository.findOrdersByUnitId(unidade_id);
        if (result.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "ORDER_NOT_FOUND",
                    "Nenhum pedido encontrado para a unidade",
                    "/pedidos/:id",
                )
            }
        }

        const orders = result.rows;

        return {
            status: 200,
            body: orders
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pedidos/:id",
            )
        }
    }
}

export const getAllOrderItemsByOrderIdService = async (order_id: string) => {
    try {
        const result = await OrderRepository.findOrderItemsByOrderId(order_id);
        if (result.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "ORDER_ITEM_NOT_FOUND",
                    "Nenhum item encontrado para o pedido",
                    "/pedidos/itens/:id"
                )
            }
        }

        const orderItems = result.rows;

        return {
            status: 200,
            body: orderItems
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pedidos/itens/:id"
            )
        }
    }
}

export const getOrderByIdService = async (order_id: string) => {
    try {
        const result = await OrderRepository.findOrderById(order_id);
        if (result.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "ORDER_NOT_FOUND",
                    "Pedido não encontrado",
                    "/pedidos/status/:id"
                )
            }
        }

        const order = result.rows[0];

        return {
            status: 200,
            body: order
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pedidos/status/:id"
            )
        }
    }
}

export const createOrderService = async (unidade_id: string, orderData: { items: Array<{ produto_id: string; quantidade: number }>}, canal_pedido: string, forma_pagamento: string) => {
    try {
        // Validate that unit exists
        const unitResult = await UnitRepository.findUnitById(unidade_id);
        if (unitResult.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "UNIT_NOT_FOUND",
                    "Unidade não encontrada",
                    "/pedidos"
                )
            }
        }

        // Validate products exist and are active
        for (const item of orderData.items) {
            const productResult = await MenuRepository.findProductById(item.produto_id);
            if (productResult.rows.length === 0 || !productResult.rows[0].ativo) {
                return {
                    status: 404,
                    body: createErrorMessage(
                        "PRODUCT_NOT_FOUND",
                        `Produto ${item.produto_id} não encontrado ou inativo`,
                        "/pedidos"
                    )
                }
            }

            // Get recipe items for this product
            const recipeResult = await MenuRepository.findRecipeByProductId(item.produto_id);
            if (recipeResult.rows.length === 0) {
                return {
                    status: 404,
                    body: createErrorMessage(
                        "RECIPE_NOT_FOUND",
                        `Receita não encontrada para o produto ${item.produto_id}`,
                        "/pedidos"
                    )
                }
            }

            // Check stock availability for each ingredient
            for (const recipeItem of recipeResult.rows) {
                const stockResult = await InventoryRepository.findItemByItemId(recipeItem.estoque_item_id);
                
                if (stockResult.rows.length === 0) {
                    return {
                        status: 404,
                        body: createErrorMessage(
                            "STOCK_ITEM_NOT_FOUND",
                            `Item de estoque ${recipeItem.estoque_item_id} não encontrado`,
                            "/pedidos"
                        )
                    }
                }

                const requiredQuantity = recipeItem.quantidade_usada * item.quantidade;
                const availableQuantity = stockResult.rows[0].estoque_atual;

                if (availableQuantity < requiredQuantity) {
                    return {
                        status: 422,
                        body: createErrorMessage(
                            "INSUFFICIENT_STOCK",
                            `Quantidade insuficiente em estoque para o item ${recipeItem.estoque_item_id}. Disponível: ${availableQuantity}, Necessário: ${requiredQuantity}`,
                            "/pedidos"
                        )
                    }
                }
            }
        }

        // Create the order
        const total = await calculateOrderTotal(orderData.items);
        
        const status = "cozinha"

        const orderResult = await OrderRepository.createOrder(unidade_id, total, canal_pedido, forma_pagamento, status);
        const order_id = orderResult.rows[0].id;

        // Create order items
        for (const item of orderData.items) {
            const productResult = await MenuRepository.findProductById(item.produto_id);
            const product = productResult.rows[0];
            const subtotal = product.preco * item.quantidade;
            await OrderRepository.createOrderItem(order_id, item.produto_id, item.quantidade, product.preco, subtotal);

            // Deduct from stock and record movement
            const recipeResult = await MenuRepository.findRecipeByProductIdExtended(item.produto_id);
            for (const recipeItem of recipeResult.rows) {
                const requiredQuantity = recipeItem.quantidade_usada * item.quantidade;
                await InventoryRepository.updateInventory(recipeItem.estoque_item_id, -requiredQuantity);
                // Record stock movement
                await InventoryRepository.createInventoryMovement(unidade_id, recipeItem.estoque_item_id, recipeItem.nome_ingrediente, "saida", requiredQuantity);
            }
        }

        // Create pending payment record
        await PaymentRepository.createOrderPayment(unidade_id, order_id, forma_pagamento, total, "pendente");

        return {
            status: 201,
            body: { order_id, message: "Pedido criado com sucesso" }
        }
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pedidos"
            )
        }
    }
}

export const calculateOrderTotal = async (items: { produto_id: string; quantidade: number; }[]) => {
    let total = 0;
    for (const item of items) {
        const productResult = await MenuRepository.findProductById(item.produto_id);
        if (productResult.rows.length > 0) {
            const product = productResult.rows[0];
            total += product.preco * item.quantidade;
        }
    }
    return total;
}

export const updateOrderStatusService = async (order_id: string, status: string) => {
    try {
        const orderResult = await OrderRepository.findOrderById(order_id);
        if (orderResult.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "ORDER_NOT_FOUND",
                    "Pedido não encontrado",
                    "/pedidos/:id"
                )
            }
        }
        
        if (orderResult.rows[0].status === "entregue" || orderResult.rows[0].status === "cancelado") {
            return {
                status: 400,
                body: createErrorMessage(
                    "ORDER_STATUS_UPDATE_NOT_ALLOWED",
                    "Não é permitido alterar o status de um pedido entregue ou cancelado",
                    "/pedidos/:id"
                )
            }
        }

        await OrderRepository.updateOrderStatus(order_id, status);

        return {
            status: 200,
            body: { message: "Status do pedido atualizado com sucesso" }
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pedidos/:id"
            )
        }
    }
}

export const cancelOrderService = async (order_id: string) => {
    try {
        const orderResult = await OrderRepository.findOrderById(order_id);
        if (orderResult.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "ORDER_NOT_FOUND",
                    "Pedido não encontrado",
                    "/pedidos/cancelar/:id"
                )
            }
        }

        const order = orderResult.rows[0];

        if (order.status === "cancelado") {
            return {
                status: 409,
                body: createErrorMessage(
                    "ORDER_ALREADY_CANCELLED",
                    "Pedido já está cancelado",
                    "/pedidos/cancelar/:id"
                )
            }
        }

        if (order.status === "entregue") {
            return {
                status: 409,
                body: createErrorMessage(
                    "ORDER_ALREADY_DELIVERED",
                    "Pedido já foi entregue",
                    "/pedidos/cancelar/:id"
                )
            }
        }

        await OrderRepository.updateOrderStatus(order_id, "cancelado");
        await PaymentRepository.insertPaymentCanceled({
            unidadeId: order.unidade_id,
            pedidoId: order.id,
            metodoPagamento: order.forma_pagamento,
            valor: order.total,
            status: "cancelado"
        });

        return {
            status: 200,
            body: { message: "Pedido cancelado com sucesso" }
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pedidos/cancelar/:id"
            )
        }
    }
}
