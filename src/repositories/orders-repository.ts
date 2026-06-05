import { pool } from "../database";

export const findOrdersByUnitId = async (unidade_id: string) => {
    return await pool.query(
        "SELECT id, total, canal_pedido, forma_pagamento, status, created_at FROM pedidos WHERE unidade_id = $1 ORDER BY created_at DESC;",
        [unidade_id]
    );
}

export const findOrderItemsByOrderId = async (order_id: string) => {
    return await pool.query("SELECT * FROM pedido_itens WHERE pedido_id = $1;", [order_id]);
}

export const findOrderById = async (order_id: string) => {
    return await pool.query("SELECT * FROM pedidos WHERE id = $1;", [order_id]);
}

export const createOrder = async (unidade_id: string, total: number, canal_pedido: string, forma_pagamento: string, status: string) => {
    return await pool.query(
        "INSERT INTO pedidos (unidade_id, total, canal_pedido, forma_pagamento, status) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [unidade_id, total, canal_pedido, forma_pagamento, status]
    );
}

export const createOrderItem = async (order_id: string, produto_cardapio_id: string, quantidade: number, preco_unidade: number, subtotal: number) => {
    return await pool.query(
        "INSERT INTO pedido_itens (pedido_id, produto_cardapio_id, quantidade, preco_unidade, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [order_id, produto_cardapio_id, quantidade, preco_unidade, subtotal]
    );
}

export const updateOrderStatus = async (order_id: string, status: string) => {
    return await pool.query(
        "UPDATE pedidos SET status = $1 WHERE id = $2;",
        [status, order_id]
    );
}
