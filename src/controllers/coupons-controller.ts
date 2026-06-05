import { Request, Response } from "express";
import * as CouponsService from "../services/coupons-service";

export const getCoupons = async (req: Request, res: Response) => {
    const id = req.params.id as string;

        let httpResponse = await CouponsService.getAllCouponsService();
    
        return res.status(httpResponse.status).json(httpResponse.body);
}

export const createCoupon = async (req: Request, res: Response) => {
    const cupom_data = req.body as CouponsService.Coupon;

    let httpResponse = await CouponsService.createCouponService(cupom_data);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const createPrivateCoupon = async (req: Request, res: Response) => {
    const cupom_data = req.body as CouponsService.PrivateCoupon;

    let httpResponse = await CouponsService.createPrivateCouponService(cupom_data);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const redeemCoupon = async (req: Request, res: Response) => {
    const cupom_data = req.body as CouponsService.RedeemCoupon;

    let httpResponse = await CouponsService.redeemCouponService(cupom_data);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const teste = async (req: Request, res: Response) => {
    return res.status(200).json({message: "teste"});
}