import { Request, Response } from "express";
import { getMenuService } from "../services/menus-service";

export const getMenuByUnitId = async (req: Request, res: Response) => {
    const unitId = req.params.id as string;

    let httpResponse = await getMenuService(unitId);

    return res.status(httpResponse.status).json(httpResponse.body);
}