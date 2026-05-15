import { Request, Response } from "express";
import { getAllOrdersByUnitIdService, getAllOrderItemsByOrderIdService  } from "../services/orders-service";

export const getOrders = async (req: Request, res: Response) => {
    const unitId = req.params.id as string;

    let httpResponse = await getAllOrdersByUnitIdService(unitId);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const getOrderItems = async (req: Request, res: Response) => {
    const orderId = req.params.id as string;

    let httpResponse = await getAllOrderItemsByOrderIdService(orderId);

    return res.status(httpResponse.status).json(httpResponse.body);
}