import { findPaymentsByOrderId } from "../repositories/payments-repository";
import * as PaymentService from "./payments-service";
import { getOrderByIdService } from "./orders-service";
import { createErrorMessage } from "../utils/error-message";
import { findUserByEmail, updateClientPoints } from "../repositories/users-repository"; // criar um service para isso depois
import { registerClientPointTransactionService } from "./users-service";
import { findCouponByCodeAndUnitId } from "../repositories/coupons-repository";

export async function processPaymentService(order_id: string, cliente_email: string, cupom_codigo?: string) {
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
        
        //let valor_desconto = cupom_codigo ? await PaymentService.useCouponService2(order.body.unidade_id, order.body.id, user.rows[0].id, cupom_codigo) : 0;

        let useCouponResponse = cupom_codigo 
    ? await PaymentService.useCouponService(order.body.unidade_id, order.body.id, user.rows[0].id, cupom_codigo) 
    : null;

// Busca .body.desconto se o status for 200
let valor_desconto = (useCouponResponse && useCouponResponse.status === 200) 
    ? (useCouponResponse.body as any).desconto 
    : 0;

        const random = Math.random();


        if (random < 0.7 && payment.rows[0].status !== "pago" && payment.rows[0].status !== "cancelado") {
            let registerPayment = {
                unidadeId: order.body.unidade_id,
                pedidoId: order.body.id,
                metodoPagamento: order.body.forma_pagamento,
                valor: order.body.total - (valor_desconto || 0),
                status: "pago"
            }
           
            await PaymentService.registerPaymentApprovedService(registerPayment);

            if (user.rows[0].ativo_programa_fidelidade) {
                if (order.body.total >= 1){
                    const pontos_ganhos = Math.floor(order.body.total);
                    await updateClientPoints(user.rows[0].id, pontos_ganhos);
                    await registerClientPointTransactionService({
                        unidade_id: order.body.unidade_id,
                        usuario_id: user.rows[0].id,
                        pontos: pontos_ganhos,
                        tipo_transacao: "ganho",
                        descricao: `Acúmulo de pontos pelo pedido ${order.body.id}`
                    });
                }
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