import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth-middleware";
import * as UserService from "../services/users-service";

export const getLogin = async (req: AuthRequest, res: Response) => {
    try {
        const usuario_id = req.user?.id;
        const usuario_role = req.user?.role;
        
        let httpResponse = await UserService.getLoginService(usuario_id, usuario_role);

        return res.status(httpResponse.status).json(httpResponse.body);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Erro interno do servidor",
        });
    }
}

export const postLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let httpResponse = await UserService.userLoginService(email, password);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const postClient = async (req: Request, res: Response) => {
    const { unidade_id, name, email, password, ativo_programa_fidelidade } = req.body;

    let httpResponse = await UserService.registerClientService(unidade_id, name, email, password, ativo_programa_fidelidade);

    return res.status(httpResponse.status).json(httpResponse.body);

}

export const updateClientFidelityPoints = async (req: AuthRequest, res: Response) => {
    const usuario_id = req.user?.id;
    const ativoProgramaFidelidade = req.body.ativo_programa_fidelidade;

    let httpResponse = await UserService.updateClientFidelityPointsService(usuario_id, ativoProgramaFidelidade);

    return res.status(httpResponse.status).json(httpResponse.body);
}