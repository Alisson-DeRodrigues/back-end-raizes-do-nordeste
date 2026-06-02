import { Request, Response } from "express";
import { getPaymentsLogByUnitIdService } from "../services/payments-service";

export const getPaymentLog = async (req: Request, res: Response) => {
    const unidade_id = req.params.id as string;

    let httpResponse = await getPaymentsLogByUnitIdService(unidade_id);

    return res.status(httpResponse.status).json(httpResponse.body);
}