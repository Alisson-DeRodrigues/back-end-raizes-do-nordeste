import { Request, Response } from "express";
import { getInventoryItemsByUnitIdService } from "../services/inventories-service";

export const getInventoryItems = async (req: Request, res: Response) => {
    const unitId = req.params.id as string;

    let httpResponse = await getInventoryItemsByUnitIdService(unitId);

    return res.status(httpResponse.status).json(httpResponse.body);
}