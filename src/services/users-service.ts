import * as UserRepository from "../repositories/users-repository";
import { createErrorMessage } from "../utils/error-message";
import { comparePassword, generateToken, hashPassword } from "./auth-service";


export const userLoginService = async (email: string, password: string) => {
    try {
        const result = await UserRepository.findUserByEmail(email);
    
        if (result.rows.length === 0) {
            return {
                status: 401,
                body: createErrorMessage(
                    "LOGIN_UNAUTHORIZED",
                    "Usuário não encontrado",
                    "/login",
                    [{ field: "email", issue: "Email não encontrado no sistema" }]
                )
            }

        }
    
        const user = result.rows[0];

        const valid = await comparePassword(password, user.senha);
    
        if (!valid) {
            return {
                status: 401,
                body: createErrorMessage(
                    "LOGIN_UNAUTHORIZED",
                    "Usuário ou senha inválidos",
                    "/login",
                    [{ field: "password", issue: "Senha incorreta" }]
                )
            }
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
                body: createErrorMessage(
                    "INTERNAL_SERVER_ERROR",
                    "Erro interno do servidor",
                    "/login",
                )
            }
        
      }
}

export const registerClientService = async (unidade_id: number, name: string, email: string, password: string, ativo_programa_fidelidade: boolean) => {
    try {
        const existingUser = await UserRepository.findUserByEmail(email);
    
        if (existingUser.rows.length > 0) {
            return {
                status: 400,
                body: createErrorMessage(
                    "USER_VALIDATION_ERROR",
                    "Usuário já existe",
                    "/register",
                    [{ field: "email", issue: "Email já cadastrado" }]
                )
            }
        }
    
        const hashedPassword = await hashPassword(password);

        const role = "cliente";

        const result = await UserRepository.createClient(unidade_id, name, email, hashedPassword, role, ativo_programa_fidelidade);
    
        if (result.rowCount === 0) {
            return {
                status: 500,
                body: createErrorMessage(
                    "INTERNAL_SERVER_ERROR",
                    "Erro interno do servidor",
                    "/register",
                )
            }
        }
    
        return {
            status: 201,
            body: { message: "Cliente registrado com sucesso" }
        };
    
      } catch (err) {
        console.error(err);
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/register",
            )
        }
  }
}