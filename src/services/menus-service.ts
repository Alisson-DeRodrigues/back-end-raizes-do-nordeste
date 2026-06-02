import * as MenuRepository from "../repositories/menus-repository";
import { createErrorMessage } from "../utils/error-message";
import { MenuItem } from "../controllers/menus-controller";
import * as UnitRepository from "../repositories/units-repository";

export const getMenuService = async (unidade_id: string) => {
    try {
        const result = await MenuRepository.findMenuByUnitId(unidade_id);
        if (result.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "MENU_NOT_FOUND",
                    "Cardápio não encontrado para a unidade",
                    "/cardapio/:id",
                )
            }
            
        }

        const menu = result.rows;

        return {
            status: 200,
            body: menu
        };
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/cardapio/:id"
            )
        };
    }
}

export const createMenuItemService = async (menuItem: MenuItem) => {
    try {
        const unitResult = await UnitRepository.findUnitById(menuItem.unidade_id);
        
        const itemExists = async () => {
            if (menuItem.id) {
                return await MenuRepository.findProductById(menuItem.id);
            }
        }

        if (!unitResult || unitResult.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "UNIT_NOT_FOUND",
                    "Unidade não encontrada",
                    "/cardapio"
                )
            };
        }

        if (menuItem.id) {
            const productResult = await MenuRepository.findProductById(menuItem.id);
            if (productResult && productResult.rows.length > 0) {
                return {
                    status: 409,
                    body: createErrorMessage(
                        "MENU_ITEM_ALREADY_EXISTS",
                        "Item de cardápio já existe",
                        "/cardapio"
                    )
                };
            }
        }


        const result = await MenuRepository.createMenuItem(menuItem);

        return {
            status: 201,
            body: result.rows[0]
        };
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/cardapio"
            )
        };
    }
}