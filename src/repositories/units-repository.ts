import { pool } from "../database";

export const findAllUnits = async () => {
  return await pool.query("SELECT * FROM unidades");
}

export const findUnitById = async (unidade_id: string) => {
    return await pool.query("SELECT * FROM unidades WHERE id = $1;", [unidade_id]);
}