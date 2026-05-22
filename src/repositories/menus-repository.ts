import { pool } from "../database";

export const findMenuByUnitId = async (unitId: string) => {
    const result = await pool.query(
        "SELECT * FROM produtos_cardapio WHERE unidade_id = $1",
        [unitId]
    );

    return result;
}

export const findProductById = async (produto_id: string) => {
    return pool.query("SELECT * FROM produtos_cardapio WHERE id = $1;", [produto_id]);
}

export const findRecipeByProductId = async (produto_id: string) => {
    return pool.query("SELECT * FROM receita_produtos WHERE produto_cardapio_id = $1;", [produto_id]);
}