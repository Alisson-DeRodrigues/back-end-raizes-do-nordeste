import { findPaymentsByOrderId } from "../repositories/payments-repository";
import * as PaymentService from "./payments-service";
import { getOrderByIdService } from "./orders-service";

export async function processPaymentService(id: string) {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        let response = null;

        let order = await getOrderByIdService(id);
        let payment = await findPaymentsByOrderId(id);

        if (!order || order.status !== 200 || !payment?.rows || payment.rows.length === 0) {
            return {
                status: 404,
                body: { error: "Pedido ou pagamento não encontrado" }
            };
        }

        const random = Math.random();


        if (random < 0.7 && payment.rows[0].status !== "pago") {
            let registerPayment = {
                unidadeId: order.body.rows[0].unidade_id,
                pedidoId: order.body.rows[0].id,
                metodoPagamento: order.body.rows[0].forma_pagamento,
                valor: order.body.rows[0].total,
                status: "pago"
            }
            await PaymentService.registerPaymentApprovedService(registerPayment);
            return {
                status: 200,
                body: {
                    status: "approved",
                    transactionCode: payment.rows
                }
            };
        }

        if (random < 0.9) {
        return {
            status: 400,
            body: {
                status: "refused",
                transactionCode: payment.rows
               }
            };
        }

        return {
        status: 500,
        body: {
            status: "pending",
            transactionCode: payment.rows
            }   
        };
    } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        return {
            status: 500,
            body: { error: "Erro interno do servidor" }
        };
    }
}