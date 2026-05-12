import { AuthRequest } from "../middleware/auth-middleware";
import { Response } from "express";

export const getFinance = async (req: AuthRequest, res: Response) => {
    return res.json({"message": "Dados financeiros"});
}