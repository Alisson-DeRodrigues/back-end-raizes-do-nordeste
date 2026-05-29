import { Request, Response } from "express";
import * as InventoryService from "../services/inventories-service";

export const getInventoryItems = async (req: Request, res: Response) => {
    const unidade_id = req.params.id as string;

    let httpResponse = await InventoryService.getInventoryItemsByUnitIdService(unidade_id);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const updateInventoryItem = async (req: Request, res: Response) => {
    const { item_id, quantidade, acao } = req.body;

    let httpResponse = await InventoryService.updateInventoryItemService(item_id, quantidade, acao);

    return res.status(httpResponse.status).json(httpResponse.body);
}
