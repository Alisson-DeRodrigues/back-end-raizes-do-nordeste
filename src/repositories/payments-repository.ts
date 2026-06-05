import { pool } from "../database";
import { Payment } from "../services/payments-service";

export const findPaymentsByOrderId = async (id: string) => {
  return await pool.query(
    "SELECT * FROM pagamentos_pedidos WHERE pedido_id = $1 ORDER BY created_at DESC",
    [id]
  );
}

export const findPaymentsByUnitId = async (unidade_id: string) => {
    return await pool.query(
        "SELECT * FROM pagamentos_pedidos WHERE unidade_id = $1 ORDER BY created_at DESC",
        [unidade_id]
    );
}

export const insertPaymentPaid = async (payment: Payment) => {
    await pool.query(
        "INSERT INTO pagamentos_pedidos (id, unidade_id, pedido_id, metodo_pagamento, valor, status) " +
        "VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4, $5, $6)",
        [payment.id ?? null, payment.unidadeId, payment.pedidoId, payment.metodoPagamento, payment.valor, "pago"]
    );
}

export const insertPaymentRefused = async (payment: Payment) => {
    await pool.query(
        "INSERT INTO pagamentos_pedidos (id, unidade_id, pedido_id, metodo_pagamento, valor, status) " +
        "VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4, $5, $6)",
        [payment.id ?? null, payment.unidadeId, payment.pedidoId, payment.metodoPagamento, payment.valor, "recusado"]
    );
}

export const insertPaymentCanceled = async (payment: Payment) => {
    await pool.query(
        "INSERT INTO pagamentos_pedidos (id, unidade_id, pedido_id, metodo_pagamento, valor, status) " +
        "VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4, $5, $6)",
        [payment.id ?? null, payment.unidadeId, payment.pedidoId, payment.metodoPagamento, payment.valor, "cancelado"]
    );
}

export const createOrderPayment = async (unidade_id: string, pedido_id: string, forma_pagamento: string, valor: number, status: string) => {
    return await pool.query(
        "INSERT INTO pagamentos_pedidos (unidade_id, pedido_id, metodo_pagamento, valor, status) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [unidade_id, pedido_id, forma_pagamento, valor, status]
    );
}