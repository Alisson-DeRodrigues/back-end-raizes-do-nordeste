export interface ClientPointTransaction {
    id?: string;
    unidade_id: string;
    usuario_id: string;
    pontos: number;
    tipo_transacao: string; // ganho, resgate, expirado
    descricao: string;
}