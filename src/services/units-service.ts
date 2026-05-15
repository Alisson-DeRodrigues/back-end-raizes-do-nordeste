import { findAllUnits } from "../repositories/units-repository";

export const getAllUnitsService = async () => {
    try {
        let response = null;
        const result = await findAllUnits();

        if (result.rows.length === 0) {
            response = {
                status: 404,
                body: { error: "Nenhuma unidade encontrada" }
            }
            return response;
        }

        return {
            status: 200,
            body: result.rows
        };

      } catch (err) {
        console.error(err);
        return {
            status: 500,
            body: { error: "Erro no servidor" }
        }
    }
}