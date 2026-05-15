import { pool } from "../database";

export const findInventoryItemsByUnitId = async (unitId: string) => {
    const result = await pool.query(
        "SELECT * FROM estoque_itens WHERE unidade_id = $1",
        [unitId]
    );

    return result;
}