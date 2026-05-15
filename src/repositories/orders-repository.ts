import { pool } from "../database";

export const findOrdersByUnitId = async (unitId: string) => {
    const result = await pool.query(
        "SELECT id, total, canal_pedido, forma_pagamento, status, created_at FROM pedidos WHERE unidade_id = $1 ORDER BY created_at DESC;",
        [unitId]
    );
    return result;
};

export const findOrderItemsByOrderId = async (orderId: string) => {
    const result = await pool.query("SELECT * FROM pedido_itens WHERE pedido_id = $1;", [orderId]);
    return result;
}