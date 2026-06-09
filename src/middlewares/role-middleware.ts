import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth-middleware";

export function roleMiddleware(allowedRoles: string[]) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {

    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        error: "Não autenticado"
      });
    }

    if (!allowedRoles.includes(userRole) && !allowedRoles.includes("*")) {
      return res.status(403).json({
        error: "Sem permissão"
      });
    }

    next();
  };
}