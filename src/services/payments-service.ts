import * as PaymentRepository from "../repositories/payments-repository";

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