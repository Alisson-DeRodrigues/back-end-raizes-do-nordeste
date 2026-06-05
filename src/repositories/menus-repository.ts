import { MenuItem, RecipeItem } from "../models/menu-model";
import { pool } from "../database";

export const findMenuByUnitId = async (unidade_id: string) => {
    return await pool.query(
        "SELECT * FROM produtos_cardapio WHERE unidade_id = $1",
        [unidade_id]
    );
}

export const findProductById = async (produto_id: string) => {
    return await pool.query("SELECT * FROM produtos_cardapio WHERE id = $1;", [produto_id]);
}

export const findRecipeByProductId = async (produto_id: string) => {
    return await pool.query("SELECT * FROM receita_produtos WHERE produto_cardapio_id = $1;", [produto_id]);
}

export const findRecipeByRecipeId = async (recipe_id: string) => {
    return await pool.query("SELECT * FROM receita_produtos WHERE id = $1;", [recipe_id]);
}

export const findRecipeByProductIdExtended = async (produto_cardapio_id: string) => {
    return await pool.query(`
        SELECT 
            rp.id AS receita_id,
            rp.produto_cardapio_id,
            rp.estoque_item_id,
            ei.nome AS nome_ingrediente,
            ei.unidade_de_medida,
            rp.quantidade_usada,
            rp.created_at
        FROM receita_produtos rp
        INNER JOIN estoque_itens ei ON rp.estoque_item_id = ei.id
        WHERE rp.produto_cardapio_id = $1;`, [produto_cardapio_id]
    );
}

export const createMenuItem = async (menuItem: MenuItem) => {
    return await pool.query(
        "INSERT INTO produtos_cardapio (id, unidade_id, nome, descricao, ativo, preco) " +
        " VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4, $5, $6) RETURNING *;",
        [menuItem.id ?? null, menuItem.unidade_id, menuItem.nome, menuItem.descricao, menuItem.ativo, menuItem.preco]
    );
}

export const createRecipeItem = async (recipeItem: RecipeItem) => {
    return await pool.query(
        "INSERT INTO receita_produtos (id, produto_cardapio_id, estoque_item_id, quantidade_usada) " +
        " VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4) RETURNING *;",
        [recipeItem.id ?? null, recipeItem.produto_cardapio_id, recipeItem.estoque_item_id, recipeItem.quantidade_usada]
    );
}