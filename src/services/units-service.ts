import { findAllUnits } from "../repositories/units-repository";
import { createErrorMessage } from "../utils/error-message";

export const getAllUnitsService = async () => {
    try {
        const result = await findAllUnits();

        if (result.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "UNIT_NOT_FOUND",
                    "Nenhuma unidade encontrada",
                    "/unidades",
                )
            }
        }

        return {
            status: 200,
            body: result.rows
        };

      } catch (err) {
        console.error(err);
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/unidades",
            )
        }
    }
}