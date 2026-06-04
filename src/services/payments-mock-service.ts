import { findPaymentsByOrderId } from "../repositories/payments-repository";
import * as PaymentService from "./payments-service";
import { getOrderByIdService } from "./orders-service";
import { createErrorMessage } from "../utils/error-message";
import { findUserByEmail, updateClientPoints } from "../repositories/users-repository";

export async function processPaymentService(order_id: string, cliente_email: string) {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        let user = await findUserByEmail(cliente_email);
        let order = await getOrderByIdService(order_id);
        let payment = await findPaymentsByOrderId(order_id);

        if (!user || user.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "USER_NOT_FOUND",
                    "Usuário não encontrado",
                    "/pagamentos"
                )
            }
        }

        if (!order || order.status !== 200 || !payment?.rows || payment.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "ORDER_OR_PAYMENT_NOT_FOUND",
                    "Pedido ou pagamento não encontrado",
                    "/pagamentos/"
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

            if (user.rows[0].ativo_programa_fidelidade) {
                await updateClientPoints(user.rows[0].id, order.body.total);
            }

            return {
                status: 200,
                body: {
                    status: "Pagamento aprovado",
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
                    "/pagamentos"
                )
            }
        }

        // simular tentar pagar pedido cancelado ou já entregue

        return {
            status: 500,
            body: createErrorMessage(
                "PAYMENT_PENDING",
                "Pagamento pendente, tente novamente mais tarde",
                "/pagamentos"
            )
        }
    } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pagamentos"
            )
        }
    }
}