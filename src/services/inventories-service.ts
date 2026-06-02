import { createErrorMessage } from "../utils/error-message";
import * as InventoryRepository from "../repositories/inventories-repository";
import * as UnitService from "./units-service";

export const getInventoryItemsByUnitIdService = async (unidade_id: string) => {
    try {
        const result = await InventoryRepository.findInventoryItemsByUnitId(unidade_id);

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

export const updateInventoryItemService = async (unidade_id: string, item_id: string, quantidade: number, acao: string) => {
    try {
        const unit = await UnitService.getUnitByIdService(unidade_id);

        if (unit.status !== 200) {
            return {
                status: unit.status,
                body: unit.body
            }
        }

        const item = await InventoryRepository.findItemByItemId(item_id);
        
        if (item.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "INVENTORY_ITEM_NOT_FOUND",
                    `Item de estoque ${item_id} não encontrado`,
                    "/estoques/:id"
                )
            }
        }

        if (acao === "adicionar") {
            await InventoryRepository.updateInventory(item_id, quantidade);
            await InventoryRepository.createInventoryMovement(item.rows[0].unidade_id, item_id, item.rows[0].nome, "entrada", quantidade);
        } else if (acao === "remover") {
            await InventoryRepository.updateInventory(item_id, -quantidade);
            await InventoryRepository.createInventoryMovement(item.rows[0].unidade_id, item_id, item.rows[0].nome, "saida", quantidade);
        } else {
            return {
                status: 400,
                body: createErrorMessage(
                    "INVALID_ACTION",
                    "Ação inválida. Use 'adicionar' ou 'remover'.",
                    "/estoques/:id"
                )
            }
        }

        return {
            status: 200,
            body: { 
                message: "Item de estoque atualizado com sucesso",
                item: await InventoryRepository.findItemByItemId(item_id).then(res => res.rows[0])
            }
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/estoques/:id"
            )
        }
    }
}

export interface InventoryItem {
    id?: string;
    unidade_id: string;
    nome: string;
    unidade_de_medida: string;
    estoque_minimo: number;
}

export const createInventoryItemService = async (item: InventoryItem) => {
    try {
        const unit = await UnitService.getUnitByIdService(item.unidade_id);

        if (unit.status !== 200) {
            return {
                status: unit.status,
                body: createErrorMessage(
                    "UNIT_NOT_FOUND",
                    "Unidade não encontrada",
                    "/estoques/new",
                )
            }
        }

        const result = await InventoryRepository.createInventoryItem(item);

        return {
            status: 201,
            body: result.rows[0]
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/estoques/new"
            )
        }
    }
}

export const getInventoryLogByUnitIdService = async (unidade_id: string) => {
    try {
        const unit = await UnitService.getUnitByIdService(unidade_id);

        if (unit.status !== 200) {
            return {
                status: unit.status,
                body: createErrorMessage(
                    "UNIT_NOT_FOUND",
                    "Unidade não encontrada",
                    "/estoques/log/:id",
                )
            }
        }

        const result = await InventoryRepository.findInventoryMovementsByUnitId(unidade_id);

        if (result.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "INVENTORY_MOVEMENTS_NOT_FOUND",
                    "Nenhuma movimentação de estoque encontrada para a unidade",
                    "/estoques/log/:id"
                )
            }
        }

        return {
            status: 200,
            body: result.rows
        }
    } catch (error) {
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/estoques/log/:id"
            )
        }
    }
}
