# Rotas de Login
## post /register - Realiza cadastro de clientes V
Precisa:
```json
{
    "unidade_id": "22222222-2222-2222-2222-222222222222",
    "name": "Cliente Teste",
    "email": "cliente@teste.com",
    "password": "senha123",
    "ativo_programa_fidelidade": true
}
```
Retorna:
- 201 - Cliente registrado com sucesso
```json
{
"message": "Cliente registrado com sucesso"
}
```

# Rotas de Usuário
## get /login - Retorna o usuário logado V
Precisa:
- Bearer Token

Retorna:

## post /login - Realiza login com usuário existente V
Precisa:
```json
{
  "email": "admin@restaurante.com",
  "password": "teste"
}
```

Retorna:
- 200

## post /clientes/fidelidade - Altera adesão ao programa de pontos do cliente logado V
Precisa:
- Bearer Token
```json
}
    "ativo_programa_fidelidade": true
}
```


# Rotas de unidade
## get /unidades - Retorna todas as unidades cadastradas
Precisa:
- Bearer Token

Retorna:


# Rotas de estoque
## get /estoques/:id - Retorna todos os itens do estoque  por unidade
Precisa:
- Bearer Token
- ID da unidade


Retorna:

## post /estoques/update - Altera a quantidade de um item no estoque
Precisa:
- Bearer Token
```json
{
    "unidade_id": "22222222-2222-2222-2222-222222222222",
    "item_id": "eeeeeeee-0000-0000-0000-000000000025",
    "quantidade": 1500,
    "acao": "adicionar"
}
```
 - acao = "adicionar" ou "remover"

Retorna:

## post /estoques/new - Cria um item no estoque
Precisa:
- Bearer Token
```json
{
    "unidade_id": "22222222-2222-2222-2222-222222222222",
    "nome": "Cogumelo",
    "unidade_de_medida": "kg",
    "estoque_minimo": 5
}
```

Retorna:

## get /estoques/log/:id - Retorna o log de movimentações do estoque
Precisa:
- Bearer Token
- ID da unidade

Retorna:

# Rotas de cardápio
## get /cardapio/:id - Retorna o cardápio da unidade
Precisa:
- Bearer Token
- ID da unidade

Retorna:

## post /cardapio - Cria um novo produto no cardápio
Precisa:
- Bearer Token
```json
{
    "id": "cccccccc-0000-0000-0000-000000000004",
    "unidade_id": "22222222-2222-2222-2222-222222222222",
    "nome": "Hambúrguer de Frango",
    "descricao": "Delicioso hambúrguer de frango com alface, tomate e maionese.",
    "preco": 19.90,
    "ativo": true
}
```

Retorna:

## post /cardapio/recipe - Adiciona um item de estoques a receita de um produto do cardápio
Precisa:
- Bearer Token
```json
{
    "id": "dddddddd-0000-0000-0000-000000000005",
    "produto_cardapio_id": "cccccccc-0000-0000-0000-000000000004",
    "estoque_item_id": "eeeeeeee-0000-0000-0000-000000000012",
    "quantidade_usada": 2
}
```

Retorna:

## get /cardapio/recipe/:id - Retorna a receita de um produto do cardápio
Precisa:
- Bearer Token
- Id do produto do cardápio


# Rotas de pedidos
## get /pedidos/:id - Retorna todos os pedidos de uma unidade
Precisa:
- Bearer Token
- ID da unidade

Retorna:

## get /pedidos/itens/:id - Retorna todos os produtos de um pedido
Precisa:
- Bearer Token
- ID do pedido
 
Retorna:

## post /pedidos - Cria um pedido
Precisa:
- Bearer Token
```json
{
    "unidade_id": "{{unidade_id}}",
    "items": [
        {
            "produto_id": "cccccccc-0000-0000-0000-000000000001",
            "quantidade": 2
        },
        {
            "produto_id": "cccccccc-0000-0000-0000-000000000002",
            "quantidade": 4
        }
    ],
    "canal_pedido": "totem-cupom5",
    "forma_pagamento": "debito5"
}
```
Retorna:

## put /pedidos/:id - Atualiza o status de um pedido
Precisa:
- Bearer Token
- ID do pedido
```json
{
    "status": "pronto"
}
```
status = cozinha, pronto, entregue/cancelado

Retorna:

## put /pedidos/cancelar/:id - Cancela um pedido (permite um cliente cancelar o pedido)
Precisa:
- Bearer Token
- ID do pedido

Retorna:


# Rotas de pagamentos
## post /pagamentos - Realiza o pagamento de um pedido
Precisa:
- Bearer Token
```json
{
    "order_id": "0e5c1f33-9f95-4346-aa11-13218a587250",
    "cliente_email": "cliente@email.com",
    "cupom_codigo": "CUPOM10"
}
```

Retorna:

## get /pagamentos/log/:id - Retorna o log de pagamentos da unidade
Precisa:
- Bearer Token
- ID da unidade


# Rotas de cupom
## get /cupons/:id - Retorna todos os cupons (falta retorna por unidade, id não incrementado)
Precisa:
- Bearer Token
- ID da unidade
 
Retorna:


## post /cupons - Cria um cupom
Precisa:
- Bearer Token
```json
{
    "unidade_id": "22222222-2222-2222-2222-222222222222",

    "codigo": "CUPOM10RESGATE",
    "nome": "Desconto de 10 reais por resgate de pontos",
    "descricao": "Desconto de 10 reais para pedidos acima de R$100 resgatado por pontos",
    "publico": true,
    "tipo": "fixo",
    "valor": 10,
    "valor_minimo_pedido": 100,
    "inicia_em": null,
    "expira_em": "2027-12-31T23:59:59Z",
    "max_usos": 50
}
```

Retorna:

## post /cupons/private - Associa um cupom privado a um cliente
Precisa:
- Bearer Token
```json
{
    "unidade_id": "22222222-2222-2222-2222-222222222222",
    "usuario_id": "ba000000-0000-0000-0000-000000000004",
    "cupom_id": "e9880cc0-1f88-4af1-9a2f-df503a28a37c"
}
```

## post /cupons/resgate - Resgata um cupom trocando pontos do programa fidelidade
Precisa:
- Bearer Token
```json
{
    "usuario_id": "ba000000-0000-0000-0000-000000000004",
    "unidade_id": "22222222-2222-2222-2222-222222222222",
    "codigo_id": "CUPOM10RESGATE"
}
```

Retorna: