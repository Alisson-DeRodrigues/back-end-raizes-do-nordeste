

export interface MenuItem {
    id?: string;
    unidade_id: string;
    nome: string;
    descricao: string;
    ativo: boolean;
    preco: number;
}

export interface RecipeItem {
    id?: string;
    produto_cardapio_id: string;
    estoque_item_id: string;
    quantidade_usada: number;
}