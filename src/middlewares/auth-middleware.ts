import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createErrorMessage } from "../utils/error-message";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Tipagem personalizada
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    // Verifica se enviou token
    if (!authHeader) {
      let httpResponse = {
      status: 401,
      body: createErrorMessage(
        "UNAUTHORIZED",
        "Usuário não autenticado",
        req.path
      )
    }

      return res.status(httpResponse.status).json(httpResponse.body);
    }

    // Formato esperado:
    // Bearer TOKEN
    const [, token] = authHeader.split(" ");

    if (!token) {
      let httpResponse = {
        status: 401,
        body: createErrorMessage(
          "UNAUTHORIZED",
          "Token não fornecido",
          req.path
        )
      }
      
      return res.status(httpResponse.status).json(httpResponse.body);
    }

    // Verifica token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };

    // Salva dados do usuário na request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (err) {
    let httpResponse = {
      status: 401,
      body: createErrorMessage(
        "UNAUTHORIZED",
        "Token inválido ou expirado",
        req.path
      )
    };
    return res.status(httpResponse.status).json(httpResponse.body);
  }
}