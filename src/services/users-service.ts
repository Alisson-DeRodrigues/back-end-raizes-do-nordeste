import { ClientPointTransaction } from "../models/user-model";
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
    
        const usuario = result.rows[0];

        const valid = await comparePassword(password, usuario.senha);
    
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
    
        const token = generateToken(usuario.id, usuario.role);
    
        return {
            status: 200,
            body: {
                message: "Login realizado com sucesso",
                token
            }
        }
    
      } catch (error) {
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
        }
    
      } catch (error) {
        console.error(error);
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

export const getLoginService = async (usuario_id: number | undefined, usuario_role: string | undefined) => {
    try {
        if (!usuario_id || !usuario_role) {
            return {
                status: 401,
                body: createErrorMessage(
                    "UNAUTHORIZED",
                    "Usuário não autenticado",
                    "/login"
                )
            }
        }

        return {
            status: 200,
            body: {
                message: "Perfil do usuário",
                userId: usuario_id,
                role: usuario_role
            }
        }
    } catch (error) {
        console.error(error);
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

export const updateClientFidelityPointsService = async (usuario_id: number | undefined, ativo_programa_fidelidade: boolean) => {
    try {
        if (!usuario_id) {
            return {
                status: 401,
                body: createErrorMessage(
                    "UNAUTHORIZED",
                    "Usuário não autenticado",
                    "/clientes/fidelidade"
                )
            }
        }

        const result = await UserRepository.updateClientFidelityPoints(usuario_id, ativo_programa_fidelidade);

        if (result.rowCount === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "USER_NOT_FOUND",
                    "Usuário não encontrado",
                    "/clientes/fidelidade"
                )
            }
        }

        return {
            status: 200,
            body: { message: "Pontos de fidelidade atualizados com sucesso" }
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/clientes/fidelidade"
            )
        }
    }
}

export const updateClientPoints = async (usuario_id: string, pontos: number) => {
    return await UserRepository.updateClientPoints(usuario_id, pontos);
}

// registrar transações de pontos de cleinte

export const registerClientPointTransactionService = async (transacao: ClientPointTransaction) => {
    return await UserRepository.registerClientPointTransaction(transacao);
}