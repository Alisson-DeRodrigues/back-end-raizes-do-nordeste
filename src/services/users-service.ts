import * as UserRepository from "../repositories/users-repository";
import { comparePassword, generateToken } from "./auth-service";


export const userLoginService = async (email: string, password: string) => {
    try {
        let response = null
        const result = await UserRepository.findUserByEmail(email);
    
        if (result.rows.length === 0) {
            response = {
                status: 401,
                body: { error: "Usuário não encontrado" }
            }
            return response;
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