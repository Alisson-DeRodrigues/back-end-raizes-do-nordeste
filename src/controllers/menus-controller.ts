import { Request, Response } from "express";
import * as MenuService from "../services/menus-service"


export interface MenuItem {
    id?: string;
    unidade_id: string;
    nome: string;
    descricao: string;
    ativo: boolean;
    preco: number;
}

export interface RecipeItem {
    id?: string;
    produto_cardapio_id: string;
    estoque_item_id: string;
    quantidade_usada: number;
}

export const getMenuByUnitId = async (req: Request, res: Response) => {
    const unitId = req.params.id as string;

    let httpResponse = await MenuService.getMenuService(unitId);

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
    const productId = req.params.id as string;

    let httpResponse = await MenuService.getRecipeByProductIdService(productId);

    return res.status(httpResponse.status).json(httpResponse.body);
}