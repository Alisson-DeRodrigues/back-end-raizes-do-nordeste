import { findInventoryItemsByUnitId } from "../repositories/inventories-repository";
import { createErrorMessage } from "../utils/error-message";

export const getInventoryItemsByUnitIdService = async (unidade_id: string) => {
    try {
        const result = await findInventoryItemsByUnitId(unidade_id);

        if (result.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "INVENTORY_NOT_FOUND",
                    "Nenhum item de estoque encontrado para a unidade",
                    "/estoques/:id",
                )
            }
        }

        const inventoryItems = result.rows;

        return {
            status: 200,
            body: inventoryItems
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/estoques/:id",
            )
        }
    }
}