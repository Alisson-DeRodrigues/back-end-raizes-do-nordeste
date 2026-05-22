import { pool } from "../database";

export const findAllUnits = async () => {
  const result = await pool.query("SELECT * FROM unidades");

  return result;
}

export const findUnitById = async (unidade_id: string) => {
    return pool.query("SELECT * FROM unidades WHERE id = $1;", [unidade_id]);
}