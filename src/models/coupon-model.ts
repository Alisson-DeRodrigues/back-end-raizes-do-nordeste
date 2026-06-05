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

export interface PrivateCoupon {
    id?: string;
    unidade_id: string;
    usuario_id: string;
    cupom_id: string;
}

export interface RedeemCoupon {
    usuario_id: string;
    unidade_id: string;
    codigo_id: string;
}