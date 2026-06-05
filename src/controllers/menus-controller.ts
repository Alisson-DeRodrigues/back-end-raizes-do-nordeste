import { Request, Response } from "express";
import * as MenuService from "../services/menus-service"
import { MenuItem, RecipeItem } from "../models/menu-model";

export const getMenuByUnitId = async (req: Request, res: Response) => {
    const unidade_id = req.params.id as string;

    let httpResponse = await MenuService.getMenuService(unidade_id);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const createMenuItem = async (req: Request, res: Response) => {
    const item: MenuItem = req.body;

    let httpResponse = await MenuService.createMenuItemService(item);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const createRecipeItem = async (req: Request, res: Response) => {
    const item: RecipeItem = req.body;

    let httpResponse = await MenuService.createRecipeItemService(item);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const getRecipeByProductId = async (req: Request, res: Response) => {
    const product_id = req.params.id as string;

    let httpResponse = await MenuService.getRecipeByProductIdService(product_id);

    return res.status(httpResponse.status).json(httpResponse.body);
}