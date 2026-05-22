import * as UserRepository from "../repositories/users-repository";
import { createErrorMessage } from "../utils/error-message";
import { comparePassword, generateToken, hashPassword } from "./auth-service";


export const userLoginService = async (email: string, password: string) => {
    try {
        let response = null
        const result = await UserRepository.findUserByEmail(email);
    
        if (result.rows.length === 0) {
            return {
                status: 401,
                body: createErrorMessage(
                    "LOGIN_UNAUTHORIZED",
                    "Usuário ou senha inválidos",
                    "/login",
                )
            }

        }
    
        const user = result.rows[0];

        const valid = await comparePassword(password, user.senha);
    
        if (!valid) {
            response = {
                status: 401,
                body: { error: "Senha inválida" }
            }
            return response;
        }
    
        const token = generateToken(user.id, user.role);
    
        return {
            status: 200,
            body: {
                message: "Login realizado com sucesso",
                token
            }
        };
    
      } catch (err) {
        console.error(err);
        return {
            status: 500,
            body: { error: "Erro no servidor" }
        }
      }
}

export const registerClientService = async (unidade_id: number, name: string, email: string, password: string, ativo_programa_fidelidade: boolean) => {
    try {
        let response = null;
        const existingUser = await UserRepository.findUserByEmail(email);
    
        if (existingUser.rows.length > 0) {
            response = {
                status: 400,
                body: { error: "Email já cadastrado" }
            }
            return response;
        }
    
        const hashedPassword = await hashPassword(password);

        const role = "cliente";

        const result = await UserRepository.createClient(unidade_id, name, email, hashedPassword, role, ativo_programa_fidelidade);
    
        if (result.rowCount === 0) {
            response = {
                status: 500,
                body: { error: "Erro ao criar usuário" }
            }
            return response;
        }
    
        return {
            status: 201,
            body: { message: "Cliente registrado com sucesso" }
        };
    
      } catch (err) {
        console.error(err);
        return {
            status: 500,
            body: { error: "Erro no servidor" }
        }
  }
}