erDiagram
    franquias {
        UUID id PK
        VARCHAR nome
        TIMESTAMP created_at
    }

    unidades {
        UUID id PK
        UUID franquia_id FK
        VARCHAR nome
        TIMESTAMP created_at
    }

    estoque_itens {
        UUID id PK
        UUID unidade_id FK
        VARCHAR nome
        VARCHAR unidade_de_medida
        NUMERIC estoque_atual
        NUMERIC estoque_minimo
        TIMESTAMP created_at
    }

    produtos_cardapio {
        UUID id PK
        UUID unidade_id FK
        VARCHAR nome
        TEXT descricao
        BOOLEAN ativo
        NUMERIC preco
        TIMESTAMP created_at
    }

    receita_produtos {
        UUID id PK
        UUID produto_cardapio_id FK
        UUID estoque_item_id FK
        NUMERIC quantidade_usada
        TIMESTAMP created_at
    }

    pedidos {
        UUID id PK
        UUID unidade_id FK
        NUMERIC total
        VARCHAR canal_pedido
        VARCHAR forma_pagamento
        VARCHAR status
        TIMESTAMP created_at
    }

    pedido_itens {
        UUID id PK
        UUID pedido_id FK
        UUID produto_cardapio_id FK
        INTEGER quantidade
        NUMERIC preco_unidade
        NUMERIC subtotal
    }

    movimentacao_estoques {
        UUID id PK
        UUID unidade_id FK
        UUID estoque_item_id FK
        VARCHAR nome
        VARCHAR tipo
        NUMERIC quantidade
        TIMESTAMP created_at
    }

    usuarios {
        UUID id PK
        UUID unidade_id FK
        VARCHAR nome
        VARCHAR email
        TEXT senha
        BOOLEAN ativo_programa_fidelidade
        NUMERIC pontos
        TEXT role
    }

    pagamentos_pedidos {
        UUID id PK
        UUID pedido_id FK
        VARCHAR metodo_pagamento
        NUMERIC valor
        VARCHAR status
        TIMESTAMP created_at
    }

    cupons {
        UUID id PK
        UUID unidade_id FK
        VARCHAR codigo
        VARCHAR nome
        TEXT descricao
        BOOLEAN publico
        VARCHAR tipo
        NUMERIC valor
        NUMERIC valor_minimo_pedido
        TIMESTAMP inicia_em
        TIMESTAMP expira_em
        INTEGER max_usos
        INTEGER usos_atuais
        BOOLEAN ativo
        TIMESTAMP created_at
    }

    cupons_clientes {
        UUID id PK
        UUID unidade_id FK
        UUID usuario_id FK
        UUID cupom_id FK
        TIMESTAMP usado_em
        VARCHAR status
        TIMESTAMP atribuido_em
    }

    pontos_transacao {
        UUID id PK
        UUID unidade_id FK
        UUID usuario_id FK
        INTEGER pontos
        VARCHAR tipo_transacao
        TEXT descricao
        TIMESTAMP created_at
    }

    %% Relacionamentos principais
    franquias ||--o{ unidades : "possui"
    unidades ||--o{ estoque_itens : "gerencia"
    unidades ||--o{ produtos_cardapio : "oferece"
    unidades ||--o{ pedidos : "recebe"
    unidades ||--o{ movimentacao_estoques : "registra"
    unidades ||--o{ usuarios : "possui"
    unidades ||--o{ cupons : "cria"
    unidades ||--o{ cupons_clientes : "valida"
    unidades ||--o{ pontos_transacao : "computa"

    %% Relacionamentos de negócio/mecanismo
    produtos_cardapio ||--o{ receita_produtos : "compoe"
    estoque_itens ||--o{ receita_produtos : "usado_em"
    estoque_itens ||--o{ movimentacao_estoques : "sofre"
    
    pedidos ||--o{ pedido_itens : "contem"
    produtos_cardapio ||--o{ pedido_itens : "incluido_em"
    pedidos ||--|| pagamentos_pedidos : "gera"

    usuarios ||--o{ cupons_clientes : "recebe"
    cupons ||--o{ cupons_clientes : "vinculado_a"
    usuarios ||--o{ pontos_transacao : "acumula/gasta"