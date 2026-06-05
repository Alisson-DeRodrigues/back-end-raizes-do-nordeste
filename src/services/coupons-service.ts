import { createErrorMessage } from "../utils/error-message";
import { getUnitByIdService } from "./units-service";
import * as CouponRepository from "../repositories/coupons-repository";
import { findUserById, updateClientPoints } from "../repositories/users-repository";

export const getAllCouponsService = async () => {
        const result = await CouponRepository.findAllCoupons();

        if (result.rows.length === 0){
            return {
                status: 204,
                body: "Nenhum cupom encontrado"
            }
        }

        return {
            status: 200,
            body: result.rows[0]
        }
};

export interface Coupon {
    id?: string;
    unidade_id: string;

    codigo: string;
    nome: string;
    descricao: string;
    publico: boolean;
    tipo: string; // porcentagem, valor_fixo
    valor: number;
    valor_minimo_pedido: number;
    inicia_em: string | null;
    expira_em: string;
    max_usos: number;
}

export const createCouponService = async (cupom: Coupon) => {
    try {
        const unidade_existe = await getUnitByIdService(cupom.unidade_id);
        const codigo_existe = await CouponRepository.findCouponByCodeAndUnitId(cupom.codigo, cupom.unidade_id);

        if(unidade_existe.status !== 200) {
            return {
                status: 404,
                body: createErrorMessage(
                    "UNIT_NOT_FOUND",
                    "Unidade não encontrada para associar o cupom",
                    "/cupons"
                )
            };
        }

        if(codigo_existe.rows.length > 0) {
            return {
                status: 409,
                body: createErrorMessage(
                    "COUPON_ALREADY_EXISTS",
                    "Cupom já existe para esta unidade",
                    "/cupons"
                )
            };
        }

        const result = await CouponRepository.createCoupon(cupom);

        return {
            status: 201,
            body: { message: "Cupom criado com sucesso", cupom: result.rows[0] }
        };

    } catch (error) {
        console.error("Error creating coupon:", error);
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/cupons"
            )
        };
    }
}

export interface PrivateCoupon {
    id?: string;
    unidade_id: string;
    usuario_id: string;
    cupom_id: string;
}
export const createPrivateCouponService = async (cupom: PrivateCoupon) => {
    try {
        const usuario_existe = await findUserById(cupom.usuario_id);
        const cupom_existe = await CouponRepository.findCouponByCouponIdAndUnitId(cupom.cupom_id, cupom.unidade_id);
        console.log(cupom_existe);

        if(usuario_existe.rows.length === 0) {
                return {
                    status: 404,
                    body: createErrorMessage(
                        "USER_NOT_FOUND",
                        "Usuário não encontrado",
                        "/cupons/private"
                    )
                };
        } 

        if (cupom_existe.rows.length === 0) {
                return {
                    status: 404,
                    body: createErrorMessage(
                        "COUPON_NOT_FOUND",
                        "Cupom não encontrado",
                        "/cupons/private"
                    )
                };
        }

        const result = await CouponRepository.createPrivateCoupon(cupom);

        return {
            status: 201,
            body: { message: "Cupom criado com sucesso", cupom: result.rows[0] }
        };

    } catch(error){
        console.log(error);
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/cupons/private"
            )
        };       
    }
}

export interface RedeemCoupon {
    usuario_id: string;
    unidade_id: string;
    codigo_id: string;
}

export const redeemCouponService = async (cupom: RedeemCoupon) => {
    try {
        const usuario_existe = await findUserById(cupom.usuario_id);
        const cupom_existe = await CouponRepository.findCouponByCodeAndUnitId(cupom.codigo_id, cupom.unidade_id);

        if(usuario_existe.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "USER_NOT_FOUND",
                    "Usuário não encontrado",
                    "/cupons/resgate"
                )
            };
        } 

        if (cupom_existe.rows.length === 0) {
            return {
                status: 404,
                body: createErrorMessage(
                    "COUPON_NOT_FOUND",
                    "Cupom não encontrado",
                    "/cupons/resgate"
                )
            };
        }

        if (usuario_existe.rows[0].pontos < cupom_existe.rows[0].valor) {
            return {
                status: 400,
                body: createErrorMessage(
                    "INSUFFICIENT_POINTS",
                    "Pontos insuficientes para resgatar este cupom",
                    "/cupons/resgate"
                )
            };
        }

        if (usuario_existe.rows[0].pontos >= cupom_existe.rows[0].valor){
            await updateClientPoints(cupom.usuario_id, -cupom_existe.rows[0].valor);
            await createPrivateCouponService({
                unidade_id: cupom.unidade_id,
                usuario_id: cupom.usuario_id,
                cupom_id: cupom_existe.rows[0].id
            });

            return {
                status: 201,
                body: { message: "Cupom resgatado com sucesso", usuario: usuario_existe.rows[0], cupom: cupom_existe.rows[0] }
            };
        }

        return {
            status: 400,
            body: createErrorMessage(
                "UNKNOWN_ERROR",
                "Ocorreu um erro desconhecido ao resgatar o cupom",
                "/cupons/resgate"
            )
        };
        
    } catch(error){
        console.log(error);
        return {
            status: 500,
            body: createErrorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/cupons/resgate"
            )
        };       
    }
}