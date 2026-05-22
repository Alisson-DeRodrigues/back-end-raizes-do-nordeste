import { Request, Response } from "express";
import { processPaymentService } from "../services/payments-mock-service";

export const processPaymentMock = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    let httpResponse = await processPaymentService(id);

    return res.status(httpResponse.status).json(httpResponse.body);
}