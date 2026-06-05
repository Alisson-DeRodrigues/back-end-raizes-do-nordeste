import { Request, Response } from "express";
import { processPaymentService } from "../services/payments-mock-service";

export const processPaymentMock = async (req: Request, res: Response) => {
    const { order_id, cliente_email, cupom_codigo } = req.body;

    let httpResponse = await processPaymentService(order_id, cliente_email, cupom_codigo);

    return res.status(httpResponse.status).json(httpResponse.body);
}