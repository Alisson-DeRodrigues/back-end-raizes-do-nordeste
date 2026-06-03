import * as MenuRepository from "../repositories/menus-repository";
import { createErrorMessage } from "../utils/error-message";
import { MenuItem, RecipeItem } from "../controllers/menus-controller";
import * as UnitRepository from "../repositories/units-repository";
import * as InventoryRepository from "../repositories/inventories-repository";

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

export const getRecipeByProductIdService = async (id: string) => {
    try {
        const result = await MenuRepository.findRecipeByProductIdExtended(id);
        if (result.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "RECIPE_NOT_FOUND",
                    "Receita não encontrada para o item de cardápio",
                    "/cardapio/recipe/:id",
                )
            }
            
        }

        const recipe = result.rows;

        return {
            status: 200,
            body: recipe
        };
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/cardapio/recipe/:id"
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

export const createRecipeItemService = async (recipeItem: RecipeItem) => {
    try {
        const productResult = await MenuRepository.findProductById(recipeItem.produto_cardapio_id);
        
        if (!productResult || productResult.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "MENU_ITEM_NOT_FOUND",
                    "Item de cardápio não encontrado",
                    "/cardapio/recipe"
                )
            };
        }

        const inventoryResult = await InventoryRepository.findItemByItemId(recipeItem.estoque_item_id);

        if (!inventoryResult || inventoryResult.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "INVENTORY_ITEM_NOT_FOUND",
                    "Item de estoque não encontrado",
                    "/cardapio/recipe"
                )
            };
        }

        if (recipeItem.id) {
            const recipeResult = await MenuRepository.findRecipeByRecipeId(recipeItem.id);
            if (recipeResult && recipeResult.rows.length > 0) {
                return {
                    status: 409,
                    body: createErrorMessage(
                        "RECIPE_ITEM_ALREADY_EXISTS",
                        "ID de item de receita já existe",
                        "/cardapio/recipe"
                    )
                };
            }
        }

        const result = await MenuRepository.createRecipeItem(recipeItem);

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
                "/cardapio/recipe"
            )
        };
    }
}