import { Request, Response } from "express";
import { authMiddleware, AuthRequest} from "../middleware/auth-middleware";
import { registerClientService, userLoginService } from "../services/users-service";

export const getLogin = async (req: AuthRequest, res: Response) => {
    console.log(req.user);

    return res.json({
      message: "Perfil do usuário",
      userId: req.user?.id,
      role: req.user?.role
    });
}

export const postLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let httpResponse = await userLoginService(email, password);

    return res.status(httpResponse.status).json(httpResponse.body);
}

export const postClient = async (req: Request, res: Response) => {
    const { unidade_id, name, email, password, ativo_programa_fidelidade } = req.body;

    let httpResponse = await registerClientService(unidade_id, name, email, password, ativo_programa_fidelidade);

    return res.status(httpResponse.status).json(httpResponse.body);

}