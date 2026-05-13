import { pool } from "../database";

export const findAllUnits = async () => {
  const result = await pool.query("SELECT * FROM unidades");

  return result;
}