import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
      return res.status(401).json({
        error: "Token não fornecido"
      });
    }

    // Formato esperado:
    // Bearer TOKEN
    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({
        error: "Token inválido"
      });
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
    return res.status(401).json({
      error: "Token inválido ou expirado"
    });
  }
}