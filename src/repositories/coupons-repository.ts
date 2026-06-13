import { pool } from "../database";
import { Coupon, PrivateCoupon } from "../models/coupon-model";

export const findCouponByCodeAndUnitId = async (cupom_codigo: string, unidade_id: string) => {
    return await pool.query(
        "SELECT * FROM cupons WHERE codigo = $1 AND unidade_id = $2",
        [cupom_codigo, unidade_id]
    );
}

export const findCouponByCouponIdAndUnitId = async (id: string, unidade_id: string) => {
    return await pool.query(
        "SELECT * FROM cupons WHERE id = $1 AND unidade_id = $2",
        [id, unidade_id]
    );
}

export const findAllCoupons = async () => {
    return await pool.query(
        "SELECT * FROM cupons"
    );
}

export const findPrivateCouponsByUserIdAndCouponId = async (usuario_id: string, cupom_id: string) => {
    return await pool.query(
        "SELECT * FROM cupons_clientes WHERE usuario_id = $1 AND cupom_id = $2",
        [usuario_id, cupom_id]
    );
}

export const findAvailablePrivateCoupons = async (usuario_id: string, cupom_id: string) => {
    return await pool.query(
        "SELECT * FROM cupons_clientes WHERE usuario_id = $1 AND cupom_id = $2 AND status = 'disponivel'",
        [usuario_id, cupom_id]
    );
}

export const createCoupon = async (cupom: Coupon) => {
    return await pool.query(
        "INSERT INTO cupons (id, unidade_id, codigo, nome, descricao, publico, tipo, valor, valor_minimo_pedido, inicia_em, expira_em, max_usos) " +
        "VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, NOW()), $11, $12) RETURNING *",
        [
            cupom.id ?? null,
            cupom.unidade_id,
            cupom.codigo,
            cupom.nome,
            cupom.descricao ?? null,
            cupom.publico,
            cupom.tipo,
            cupom.valor,
            cupom.valor_minimo_pedido,
            cupom.inicia_em ? new Date(cupom.inicia_em) : null,
            cupom.expira_em ? new Date(cupom.expira_em) : null,
            cupom.max_usos
        ]
    );
}

export const createPrivateCoupon = async (cupom: PrivateCoupon) => {
    return await pool.query(
        "INSERT INTO cupons_clientes (id, unidade_id, usuario_id, cupom_id) " +
        "VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4) RETURNING *",
        [cupom.id ?? null, cupom.unidade_id, cupom.usuario_id, cupom.cupom_id]
    );
}

export const updateCouponStatusToUsed = async (id: string) => {
    return await pool.query(
        "UPDATE cupons_clientes SET status = 'usado' WHERE id = $1",
        [id]
    );
}

export const incrementCouponUsage = async (id: string) => {
    return await pool.query(
        "UPDATE cupons SET usos_atuais = usos_atuais + 1 WHERE id = $1",
        [id]
    );
}