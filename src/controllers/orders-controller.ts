import { Request, Response } from "express";
import * as OrderService from "../services/orders-service";

export const getOrders = async (req: Request, res: Response) => {
    const unidade_id = req.params.id as string;

    let httpResponse = await OrderService.getAllOrdersByUnitIdService(unidade_id);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const getOrderItems = async (req: Request, res: Response) => {
    const order_id = req.params.id as string;

    let httpResponse = await OrderService.getAllOrderItemsByOrderIdService(order_id);

    return res.status(httpResponse.status).json(httpResponse.body);
}


export const createOrder = async (req: Request, res: Response) => {
    const data = req.body;
    const unidade_id = data.unidade_id as string;
    const canal_pedido = data.canal_pedido as string;
    const forma_pagamento = data.forma_pagamento as string;

    const orderData = { 
        items: data.items as Array<{ produto_id: string; quantidade: number }> 
    };

    let httpResponse = await OrderService.createOrderService(unidade_id, orderData, canal_pedido, forma_pagamento);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const updateOrderStatus = async (req: Request, res: Response) => {
    const order_id = req.params.id as string;
    const status = req.body.status as string;

    let httpResponse = await OrderService.updateOrderStatusService(order_id, status);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const cancelOrder = async (req: Request, res: Response) => {
    const order_id = req.params.id as string;

    let httpResponse = await OrderService.cancelOrderService(order_id);

    return res.status(httpResponse.status).json(httpResponse.body);
}