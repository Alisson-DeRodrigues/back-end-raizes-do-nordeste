import { pool } from "../database";

export const findInventoryItemsByUnitId = async (unidade_id: string) => {
    const result = await pool.query(
        "SELECT * FROM estoque_itens WHERE unidade_id = $1",
        [unidade_id]
    );

    return result;
}

export const findItemByItemId = async (item_id: any) => {
    return pool.query("SELECT * FROM estoque_itens WHERE id = $1;", [item_id]);
}

export const updateInventory = async (item_id: any, quantity: number) => {
    const result = await pool.query(
        "UPDATE estoque_itens SET estoque_atual = estoque_atual + $1 WHERE id = $2 RETURNING *;",
        [quantity, item_id]
    );
    return result;
};

export const createInventoryMovement = async (unidade_id: string, estoque_item_id: string, nome: string, tipo: string, quantidade: number) => {
    const result = await pool.query(
        "INSERT INTO movimentacao_estoques (unidade_id, estoque_item_id, nome, tipo, quantidade) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [unidade_id, estoque_item_id, nome, tipo, quantidade]
    );
    return result;
};