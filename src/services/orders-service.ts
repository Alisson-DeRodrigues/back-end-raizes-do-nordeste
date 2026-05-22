import * as OrderRepository from "../repositories/orders-repository";

export const getAllOrdersByUnitIdService = async (unitId: string) => {
    try {
        let response = null;
        const result = await OrderRepository.findOrdersByUnitId(unitId);
        if (result.rows.length === 0) {
            response = {
                status: 404,
                body: { error: "Nenhum pedido encontrado para a unidade" }
            }
            return response;
        }

        const orders = result.rows;

        return {
            status: 200,
            body: orders
        };
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        return {
            status: 500,
            body: { error: "Erro interno do servidor" }
        };
    }
}

export const getAllOrderItemsByOrderIdService = async (orderId: string) => {
    try {
        let response = null;
        const result = await OrderRepository.findOrderItemsByOrderId(orderId);
        if (result.rows.length === 0) {
            response = {
                status: 404,
                body: { error: "Nenhum item encontrado para o pedido" }
            }
            return response;
        }

        const orderItems = result.rows;

        return {
            status: 200,
            body: orderItems
        };
    } catch (error) {
        console.error("Erro ao buscar itens do pedido:", error);
        return {
            status: 500,
            body: { error: "Erro interno do servidor" }
        };
    }
}

export const getOrderByIdService = async (orderId: string) => {
    try {
        let response = null;
        const result = await OrderRepository.findOrderById(orderId);
        if (result.rows.length === 0) {
            response = {
                status: 404,
                body: { error: "Pedido não encontrado" }
            }
            return response;
        }

        const order = result.rows[0];

        return {
            status: 200,
            body: order
        };
    } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        return {
            status: 500,
            body: { error: "Erro interno do servidor" }
        };
    }
} 