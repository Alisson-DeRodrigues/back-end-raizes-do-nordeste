import { findAvailablePrivateCoupons, findCouponByCodeAndUnitId, findPrivateCouponsByUserIdAndCouponId, incrementCouponUsage, updateCouponStatusToUsed } from "../repositories/coupons-repository";
import * as PaymentRepository from "../repositories/payments-repository";
import { createErrorMessage } from "../utils/error-message";
import { getOrderByIdService } from "./orders-service";

export interface Payment {
    id?: string;
    unidadeId: string;
    pedidoId: string;
    metodoPagamento: string;
    valor: number;
    status: string;
}

export const registerPaymentApprovedService = async (payment: Payment) => {
    await PaymentRepository.insertPaymentPaid(payment);
}

export const registerPaymentRefusedService = async (payment: Payment) => {
    await PaymentRepository.insertPaymentRefused(payment);
}

export const cancelPaymentService = async (payment: Payment) => {
    await PaymentRepository.insertPaymentCanceled(payment);
}

export const getPaymentsLogByUnitIdService = async (unidade_id: string) => {
    try {
        const result = await PaymentRepository.findPaymentsByUnitId(unidade_id);

        if (result.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "PAYMENT_LOG_NOT_FOUND",
                    "Nenhum registro de pagamento encontrado para a unidade",
                    "/pagamentos/log/:id"
                )
            }
        }

        const paymentLog = result.rows;

        return {
            status: 200,
            body: paymentLog
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pagamentos/log/:id"
            )
        }
    }
}

export const useCouponService = async (unidade_id: string, order_id: string, usuario_id: string, cupom_codigo: string) => {
    try {
        const cupomResult = await findCouponByCodeAndUnitId(cupom_codigo, unidade_id);
        const order = await getOrderByIdService(order_id);

        // 1. Validação: Cupom existe?
        if (cupomResult.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "COUPON_NOT_FOUND",
                    "Cupom não encontrado",
                    "/pagamentos"
                )
            };
        }

        const cupom = cupomResult.rows[0];

        // 2. Validação: Valor mínimo do pedido
        if (cupom.valor_minimo_pedido > order.body.total) {
            return {
                status: 400,
                body: createErrorMessage(
                    "MINIMUM_ORDER_VALUE_NOT_MET",
                    "Valor mínimo do pedido não atingido para usar este cupom",
                    "/pagamentos"
                )
            };
        }

        if (new Date(cupom.expira_em) <= new Date()) {
            return {
                status: 400,
                body: createErrorMessage(
                    "COUPON_EXPIRED",
                    "Este cupom já expirou",
                    "/pagamentos"
                )
            };
        }

        // 3. Validação: Regras para Cupom PÚBLICO
        if (cupom.publico === true) {
            if (cupom.max_usos === cupom.usos) {
                return {
                    status: 400,
                    body: createErrorMessage(
                        "COUPON_USAGE_LIMIT_REACHED",
                        "Limite de uso do cupom atingido",
                        "/pagamentos"
                    )
                };
            } else {
                await incrementCouponUsage(cupom.id);
            }

        } 
        
        // 4. Validação: Regras para Cupom PRIVADO
        else {
            const cupom_usuario = await findAvailablePrivateCoupons(usuario_id, cupom.id);

            if (cupom_usuario.rows.length === 0) {
                return {
                    status: 404,
                    body: createErrorMessage(
                        "PRIVATE_COUPON_NOT_FOUND",
                        "Cupom válido não encontrado para este usuário",
                        "/pagamentos"
                    )
                };
            }
            // Invalida o cupom privado do cliente para impedir reuso
            await updateCouponStatusToUsed(cupom_usuario.rows[0].id);
        }

        // 5. Cálculo unificado do desconto
        
        const valor_desconto = cupom.tipo === "porcentagem" 
            ? order.body.total * (cupom.valor / 100) 
            : cupom.valor;
 
        // RETORNO PADRONIZADO: Agora sim o processPaymentService vai ler perfeitamente!
        return {
            status: 200,
            body: { desconto: valor_desconto }
        };

    } catch (error) {
        console.error("Erro no useCouponService:", error);
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pagamentos"
            )
        };
    }
}