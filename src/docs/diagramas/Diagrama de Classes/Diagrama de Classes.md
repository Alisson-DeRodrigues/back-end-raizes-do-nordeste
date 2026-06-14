classDiagram
    %% ==========================================
    %% CAMADA DE DOMÍNIO (ENTIDADES / TABELAS)
    %% ==========================================
    
    class Franquia {
        +UUID id
        +VARCHAR nome
        +TIMESTAMP created_at
    }

    class Unidade {
        +UUID id
        +UUID franquia_id
        +VARCHAR nome
        +TIMESTAMP created_at
    }

    class EstoqueItem {
        +UUID id
        +UUID unidade_id
        +VARCHAR nome
        +VARCHAR unidade_de_medida
        +NUMERIC estoque_atual
        +NUMERIC estoque_minimo
        +TIMESTAMP created_at
    }

    class ProdutoCardapio {
        +UUID id
        +UUID unidade_id
        +VARCHAR nome
        +TEXT descricao
        +BOOLEAN ativo
        +NUMERIC preco
        +TIMESTAMP created_at
    }

    class ReceitaProduto {
        +UUID id
        +UUID produto_cardapio_id
        +UUID estoque_item_id
        +NUMERIC quantidade_usada
        +TIMESTAMP created_at
    }

    class Pedido {
        +UUID id
        +UUID unidade_id
        +NUMERIC total
        +VARCHAR canal_pedido
        +VARCHAR forma_pagamento
        +VARCHAR status
        +TIMESTAMP created_at
    }

    class PedidoItem {
        +UUID id
        +UUID pedido_id
        +UUID produto_cardapio_id
        +INTEGER quantidade
        +NUMERIC preco_unidade
        +NUMERIC subtotal
    }

    class MovimentacaoEstoque {
        +UUID id
        +UUID unidade_id
        +UUID estoque_item_id
        +VARCHAR nome
        +VARCHAR tipo
        +NUMERIC quantidade
        +TIMESTAMP created_at
    }

    class Usuario {
        +UUID id
        +UUID unidade_id
        +VARCHAR nome
        +VARCHAR email
        +TEXT senha
        +BOOLEAN ativo_programa_fidelidade
        +NUMERIC pontos
        +TEXT role
    }

    class PagamentoPedido {
        +UUID id
        +UUID pedido_id
        +VARCHAR metodo_pagamento
        +NUMERIC valor
        +VARCHAR status
        +TIMESTAMP created_at
    }

    class Cupom {
        +UUID id
        +UUID unidade_id
        +VARCHAR codigo
        +VARCHAR nome
        +TEXT descricao
        +BOOLEAN publico
        +VARCHAR tipo
        +NUMERIC valor
        +NUMERIC valor_minimo_pedido
        +TIMESTAMP inicia_em
        +TIMESTAMP expira_em
        +INTEGER max_usos
        +INTEGER usos_atuais
        +BOOLEAN ativo
        +TIMESTAMP created_at
    }

    class CupomCliente {
        +UUID id
        +UUID unidade_id
        +UUID usuario_id
        +UUID cupom_id
        +TIMESTAMP usado_em
        +VARCHAR status
        +TIMESTAMP atribuido_em
    }

    class PontosTransacao {
        +UUID id
        +UUID unidade_id
        +UUID usuario_id
        +INTEGER pontos
        +VARCHAR tipo_transacao
        +TEXT descricao
        +TIMESTAMP created_at
    }

    %% ==========================================
    %% RELACIONAMENTOS ENTRE TABELAS (CHAVES ESTRANGEIRAS)
    %% ==========================================
    Franquia "1" <-- "0..*" Unidade : pertence a
    Unidade "1" <-- "0..*" EstoqueItem : possui
    Unidade "1" <-- "0..*" ProdutoCardapio : comercializa
    Unidade "1" <-- "0..*" Pedido : recebe
    Unidade "1" <-- "0..*" MovimentacaoEstoque : registra
    Unidade "1" <-- "0..*" Usuario : gerencia
    Unidade "1" <-- "0..*" Cupom : cria
    Unidade "1" <-- "0..*" CupomCliente : distribui
    Unidade "1" <-- "0..*" PontosTransacao : audita

    ProdutoCardapio "1" <-- "0..*" ReceitaProduto : composto por
    EstoqueItem "1" <-- "0..*" ReceitaProduto : usado em
    EstoqueItem "1" <-- "0..*" MovimentacaoEstoque : sofre
    
    Pedido "1" <-- "0..*" PedidoItem : contém
    ProdutoCardapio "1" <-- "0..*" PedidoItem : inserido em
    Pedido "1" <-- "0..*" PagamentoPedido : possui
    
    Usuario "1" <-- "0..*" CupomCliente : recebe
    Cupom "1" <-- "0..*" CupomCliente : aplicado em
    Usuario "1" <-- "0..*" PontosTransacao : acumula

    %% ==========================================
    %% CAMADA DE PERSISTÊNCIA (REPOSITORIES)
    %% ==========================================
    
    class CouponsRepository {
        +findCouponByCodeAndUnitId(string codigo, string unidade_id)
        +findCouponByCouponIdAndUnitId(string id, string unidade_id)
        +findAllCoupons()
        +findPrivateCouponsByUserIdAndCouponId(string usuario_id, string cupom_id)
        +findAvailablePrivateCoupons(string usuario_id, string cupom_id)
        +createCoupon(Coupon cupom)
        +createPrivateCoupon(PrivateCoupon cupom)
        +updateCouponStatusToUsed(string id)
        +incrementCouponUsage(string id)
    }

    class UsersRepository {
        +findUserByEmail(string email)
        +findUserById(string id)
        +createClient(number unidade_id, string name, string email, any hashedPassword, string role, boolean ativo_fidelidade)
        +updateClientFidelityPoints(number usuario_id, boolean ativo_fidelidade)
        +updateClientPoints(string usuario_id, number pontos)
        +registerClientPointTransaction(ClientPointTransaction transacao)
    }

    class UnitsRepository {
        +findAllUnits()
        +findUnitById(string unidade_id)
    }

    class PaymentsRepository {
        +findPaymentsByOrderId(string id)
        +findPaymentsByUnitId(string unidade_id)
        +insertPaymentPaid(Payment payment)
        +insertPaymentRefused(Payment payment)
        +insertPaymentCanceled(Payment payment)
        +createOrderPayment(string unidade_id, string pedido_id, string forma_pagamento, number valor, string status)
    }

    class OrdersRepository {
        +findOrdersByUnitId(string unidade_id)
        +findOrderItemsByOrderId(string order_id)
        +findOrderById(string order_id)
        +createOrder(string unidade_id, number total, string canal_pedido, string forma_pagamento, string status)
        +createOrderItem(string order_id, string produto_cardapio_id, number quantidade, number preco_unidade, number subtotal)
        +updateOrderStatus(string order_id, string status)
    }

    class MenusRepository {
        +findMenuByUnitId(string unidade_id)
        +findProductById(string produto_id)
        +findRecipeByProductId(string produto_id)
        +findRecipeByRecipeId(string recipe_id)
        +findRecipeByProductIdExtended(string produto_cardapio_id)
        +createMenuItem(MenuItem menuItem)
        +createRecipeItem(RecipeItem recipeItem)
    }

    class InventoriesRepository {
        +findInventoryItemsByUnitId(string unidade_id)
        +findItemByItemId(any item_id)
        +updateInventory(any item_id, number quantidade)
        +createInventoryMovement(string unidade_id, string estoque_item_id, string nome, string tipo, number quantidade)
        +createInventoryItem(InventoryItem item)
        +findInventoryMovementsByUnitId(string unidade_id)
    }

    %% ==========================================
    %% DEPENDÊNCIAS DE USO (REPOSITORY -> ENTIDADE)
    %% ==========================================
    CouponsRepository ..> Cupom : manipula
    CouponsRepository ..> CupomCliente : manipula
    
    UsersRepository ..> Usuario : manipula
    UsersRepository ..> PontosTransacao : manipula
    
    UnitsRepository ..> Unidade : manipula
    
    PaymentsRepository ..> PagamentoPedido : manipula
    
    OrdersRepository ..> Pedido : manipula
    OrdersRepository ..> PedidoItem : manipula
    
    MenusRepository ..> ProdutoCardapio : manipula
    MenusRepository ..> ReceitaProduto : manipula
    
    InventoriesRepository ..> EstoqueItem : manipula
    InventoriesRepository ..> MovimentacaoEstoque : manipula