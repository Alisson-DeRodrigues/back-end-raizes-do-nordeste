import { findPaymentsByOrderId } from "../repositories/payments-repository";
import * as PaymentService from "./payments-service";
import { getOrderByIdService } from "./orders-service";
import { createErrorMessage } from "../utils/error-message";

export async function processPaymentService(id: string) {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        let order = await getOrderByIdService(id);
        let payment = await findPaymentsByOrderId(id);

        if (!order || order.status !== 200 || !payment?.rows || payment.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "ORDER_OR_PAYMENT_NOT_FOUND",
                    "Pedido ou pagamento não encontrado",
                    "/pagamentos/:id"
                )
            }
        }

        const random = Math.random();


        if (random < 0.7 && payment.rows[0].status !== "pago" && payment.rows[0].status !== "cancelado") {
            let registerPayment = {
                unidadeId: order.body.unidade_id,
                pedidoId: order.body.id,
                metodoPagamento: order.body.forma_pagamento,
                valor: order.body.total,
                status: "pago"
            }

            await PaymentService.registerPaymentApprovedService(registerPayment);
            return {
                status: 200,
                body: {
                    status: "approved"
                }
            }
        }

        if (random < 0.9 && payment.rows[0].status !== "pago" && payment.rows[0].status !== "cancelado") {
            let registerPayment = {
                unidadeId: order.body.unidade_id,
                pedidoId: order.body.id,
                metodoPagamento: order.body.forma_pagamento,
                valor: order.body.total,
                status: "recusado"
            }

            await PaymentService.registerPaymentRefusedService(registerPayment);
            return {
                status: 400,
                body: createErrorMessage(
                    "PAYMENT_REFUSED",
                    "Pagamento recusado",
                    "/pagamentos/:id"
                )
            }
        }

        return {
            status: 500,
            body: createErrorMessage(
                "PAYMENT_PENDING",
                "Pagamento pendente, tente novamente mais tarde",
                "/pagamentos/:id"
            )
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pagamentos/:id"
            )
        }
    }
}