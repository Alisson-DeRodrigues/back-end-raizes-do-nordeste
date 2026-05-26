import { Request, Response } from "express";
import { getAllUnitsService } from "../services/units-service";

export const getAllUnits = async (req: Request, res: Response) => {
    let httpResponse = await getAllUnitsService();

    return res.status(httpResponse.status).json(httpResponse.body);
}