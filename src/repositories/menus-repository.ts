import { pool } from "../database";

export const findMenuByUnitId = async (unitId: string) => {
    const result = await pool.query(
        "SELECT * FROM produtos_cardapio WHERE unidade_id = $1",
        [unitId]
    );

    return result;
}