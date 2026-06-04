-- esquemas para franquias e unidades
CREATE TABLE franquias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE unidades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    franquia_id UUID NOT NULL REFERENCES franquias(id),

    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- esquema para itens de estoque
CREATE TABLE estoque_itens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidade_id UUID NOT NULL REFERENCES unidades(id),

    nome VARCHAR(255) NOT NULL,
    unidade_de_medida VARCHAR(255) NOT NULL, -- g, kg, ml, litro
    estoque_atual NUMERIC(10,2) NOT NULL DEFAULT 0,
    estoque_minimo NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()  
);

-- esquema para produtos do cardápio
CREATE TABLE produtos_cardapio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidade_id UUID NOT NULL REFERENCES unidades(id),

    nome VARCHAR(255) NOT NULL,
    descricao TEXT, --- opcional
    ativo BOOLEAN DEFAULT FALSE,
    preco NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE receita_produtos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    produto_cardapio_id UUID NOT NULL REFERENCES produtos_cardapio(id),
    estoque_item_id UUID NOT NULL REFERENCES estoque_itens(id),

    quantidade_usada NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- esquema para pedidos
CREATE TABLE pedidos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidade_id UUID NOT NULL REFERENCES unidades(id),

    total NUMERIC(10,2) NOT NULL,
    canal_pedido VARCHAR(30) NOT NULL, -- app, totem, balcão, web
    forma_pagamento VARCHAR(30) NOT NULL, -- dinheiro, cartão, pix, mock
    status VARCHAR(30) NOT NULL, -- cozinha, pronto, entregue/cancelado
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pedido_itens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pedido_id UUID NOT NULL REFERENCES pedidos(id),
    produto_cardapio_id UUID NOT NULL REFERENCES produtos_cardapio(id),

    quantidade INTEGER NOT NULL,
    preco_unidade NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

-- esquema para movimentação de estoque (histórico de entradas e saídas)
CREATE TABLE movimentacao_estoques (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidade_id UUID NOT NULL REFERENCES unidades(id),
    estoque_item_id UUID NOT NULL REFERENCES estoque_itens(id),

    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(30) NOT NULL, -- entrada, saida, perda, ajuste
    quantidade NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- esquema para usuários (clientes e funcionários)
CREATE TABLE usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidade_id UUID NOT NULL REFERENCES unidades(id),

    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha TEXT NOT NULL,
    ativo_programa_fidelidade BOOLEAN DEFAULT FALSE,
    pontos NUMERIC(5,1),
    role TEXT NOT NULL -- admin, cozinha, atendente, cliente
);

-- esquema para pagamentos
CREATE TABLE pagamentos_pedidos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pedido_id UUID NOT NULL REFERENCES pedidos(id),

    metodo_pagamento VARCHAR(30) NOT NULL, -- dinheiro, cartão, pix, mock
    valor NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL, -- pendente, pago, recusado, cancelado
    created_at TIMESTAMP DEFAULT NOW()
);

-- esquema para cupons
CREATE TABLE cupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidade_id UUID NOT NULL REFERENCES unidades(id),

    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    publico BOOLEAN DEFAULT FALSE,
    tipo VARCHAR(30) NOT NULL, -- porcentagem, valor_fixo
    valor NUMERIC(10,2) NOT NULL,
    valor_minimo_pedido NUMERIC(10,2),
    inicia_em TIMESTAMP DEFAULT NOW(),
    expira_em TIMESTAMP,
    max_usos INTEGER,
    usos_atuais INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cupons_clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidade_id UUID NOT NULL REFERENCES unidades(id),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    cupom_id UUID NOT NULL REFERENCES cupons(id),

    usado_em TIMESTAMP,
    status VARCHAR(20) DEFAULT 'disponivel', -- disponivel, usado, expirado
    atribuido_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pontos_transacao (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidade_id UUID NOT NULL REFERENCES unidades(id),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),

    pontos INTEGER NOT NULL,
    tipo_transacao VARCHAR(20) NOT NULL, -- ganho, resgate, expirado
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);