import * as MenuRepository from "../repositories/menus-repository";
import { createErrorMessage } from "../utils/error-message";

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