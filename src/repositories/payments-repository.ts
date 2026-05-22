import { pool } from "../database";
import { Payment } from "../services/payments-service";

export const findPaymentsByOrderId = async (id: string) => {
  const result = await pool.query(
    "SELECT * FROM pagamentos_pedidos WHERE pedido_id = $1 ORDER BY created_at DESC",
    [id]
  );

  return result;
}

export const insertPaymentPaid = async (payment: Payment) => {
    await pool.query(
        "INSERT INTO pagamentos_pedidos (id, unidade_id, pedido_id, metodo_pagamento, valor, status) VALUES ($1, $2, $3, $4, $5, $6)",
        [payment.id ?? null, payment.unidadeId, payment.pedidoId, payment.metodoPagamento, payment.valor, "pago"]
    );
}