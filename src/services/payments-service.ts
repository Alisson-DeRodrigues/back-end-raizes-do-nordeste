import * as PaymentRepository from "../repositories/payments-repository";
import { createErrorMessage } from "../utils/error-message";

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