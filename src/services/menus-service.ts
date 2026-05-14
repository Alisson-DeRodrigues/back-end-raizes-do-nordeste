import * as MenuRepository from "../repositories/menus-repository";

export const getMenuService = async (unitId: string) => {
    try {
        let response = null;
        const result = await MenuRepository.findMenuByUnitId(unitId);
        if (result.rows.length === 0) {
            response = {
                status: 404,
                body: { error: "Cardápio não encontrado para a unidade" }
            }
            return response;
        }

        // const menu = result.rows[0]; // exibe somente o primeiro item do cardápio encontrado para a unidade
        const menu = result.rows; // exibe todos os itens do cardápio encontrado para a unidade

        return {
            status: 200,
            body: menu
        };
    } catch (error) {
        console.error("Erro ao buscar cardápio:", error);
        return {
            status: 500,
            body: { error: "Erro interno do servidor" }
        };
    }
}