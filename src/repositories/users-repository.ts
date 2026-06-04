import { pool } from "../database";

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  );

  return result;
}

export const findUserById = async (id: string) => {
    const result = await pool.query(
        "SELECT * FROM usuarios WHERE id = $1",
        [id]
    );

    return result;
}

export const createClient = async (unidade_id: number, name: string, email: string, hashedPassword: any, role: string, ativo_programa_fidelidade: boolean) => {
    return await pool.query(
        "INSERT INTO usuarios (unidade_id, nome, email, senha, role, ativo_programa_fidelidade) VALUES ($1, $2, $3, $4, $5, $6)",
        [unidade_id, name, email, hashedPassword, role, ativo_programa_fidelidade]
    );
}

export const updateClientFidelityPoints = async (usuario_id: number, ativo_programa_fidelidade: boolean) => {
    return await pool.query(
        "UPDATE usuarios SET ativo_programa_fidelidade = $2 WHERE id = $1",
        [usuario_id, ativo_programa_fidelidade]
    );
}

export const updateClientPoints = async (usuario_id: string, pontos: number) => {
    return await pool.query(
        "UPDATE usuarios SET pontos = pontos + $2 WHERE id = $1",
        [usuario_id, pontos]
    );
}