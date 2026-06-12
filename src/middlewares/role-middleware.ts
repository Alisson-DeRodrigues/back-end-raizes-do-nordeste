import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth-middleware";
import { createErrorMessage } from "../utils/error-message";

export function roleMiddleware(allowedRoles: string[]) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {

    const userRole = req.user?.role;

    if (!userRole) {
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

    if (!allowedRoles.includes(userRole) && !allowedRoles.includes("*")) {
      let httpResponse = {
        status: 403,
        body: createErrorMessage(
          "FORBIDDEN",
          "Usuário sem permissão",
          req.path
        )
      }

      return res.status(httpResponse.status).json(httpResponse.body);
    }

    next();
  };
}