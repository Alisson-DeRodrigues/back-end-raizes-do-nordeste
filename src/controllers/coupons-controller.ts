import { Request, Response } from "express";
import * as CouponsService from "../services/coupons-service";
import { Coupon, PrivateCoupon, RedeemCoupon } from "../models/coupon-model";

export const getCoupons = async (req: Request, res: Response) => {
        let httpResponse = await CouponsService.getAllCouponsService();
    
        return res.status(httpResponse.status).json(httpResponse.body);
}

export const createCoupon = async (req: Request, res: Response) => {
    const cupom_data = req.body as Coupon;

    let httpResponse = await CouponsService.createCouponService(cupom_data);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const createPrivateCoupon = async (req: Request, res: Response) => {
    const cupom_data = req.body as PrivateCoupon;

    let httpResponse = await CouponsService.createPrivateCouponService(cupom_data);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const redeemCoupon = async (req: Request, res: Response) => {
    const cupom_data = req.body as RedeemCoupon;

    let httpResponse = await CouponsService.redeemCouponService(cupom_data);

    return res.status(httpResponse.status).json(httpResponse.body);
}