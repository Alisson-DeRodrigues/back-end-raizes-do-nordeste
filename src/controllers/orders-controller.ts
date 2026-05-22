import { Request, Response } from "express";
import * as OrderService from "../services/orders-service";

export const getOrders = async (req: Request, res: Response) => {
    const unitId = req.params.id as string;

    let httpResponse = await OrderService.getAllOrdersByUnitIdService(unitId);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const getOrderItems = async (req: Request, res: Response) => {
    const orderId = req.params.id as string;

    let httpResponse = await OrderService.getAllOrderItemsByOrderIdService(orderId);

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

