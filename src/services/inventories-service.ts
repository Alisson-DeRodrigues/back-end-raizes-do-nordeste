import { findInventoryItemsByUnitId } from "../repositories/inventories-repository";

export const getInventoryItemsByUnitIdService = async (unitId: string) => {
    try {
        let response = null;
        const result = await findInventoryItemsByUnitId(unitId);

        if (result.rows.length === 0) {
            response = {
                status: 404,
                body: { error: "Nenhum item de estoque encontrado para a unidade" }
            }
            return response;
        }

        const inventoryItems = result.rows;

        return {
            status: 200,
            body: inventoryItems
        };
    } catch (error) {
        console.error("Erro ao buscar itens de estoque:", error);
        return {
            status: 500,
            body: { error: "Erro interno do servidor" }
        };
    };
}