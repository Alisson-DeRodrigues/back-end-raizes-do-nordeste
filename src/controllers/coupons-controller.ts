import { Request, Response } from "express";
import * as CouponsService from "../services/coupons-service";

export const getCoupons = async (req: Request, res: Response) => {
    const id = req.params.id as string;

        let httpResponse = await CouponsService.getAllCouponsService(id);
    
        return res.status(httpResponse.status).json(httpResponse.body);
}