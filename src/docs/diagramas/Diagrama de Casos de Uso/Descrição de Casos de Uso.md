# UC01 - Realizar pedido
## Descrição
Realizar um pedido de algum produto do cardápio.

## Ator principal
Cliente.

## Demais atores
Atendente, quando fora dos canais de autoatendimento (totem, web, App).

## Pré-condições
Usuário já cadastrado.
Produto disponível em cardápio.

## Pós-condições
O status do pedido fica "cozinha".
O status do pagamento fica "pendente".
O sistema emite aviso.

## Origem das informações
Banco de dados da rede;
Usuários nos diferentes canais de atendimento (atendente, totem, web, app).

## Usuários responsáveis
N/C

## Pendências
N/C

## Fluxo base
Usuário consulta o cardápio;
Usuário escolhe o produto;
Usuário escolhe a quantidade;
Usuário escolhe a forma de pagamento;
Usuário confirma o pedido;
Sistema emite aviso.

## Fluxo alternativo
N/C

## Regras de negócio
RN01 - O produto deve existir no cardápio.
RN02 - O produto deve estar ativo no cardápio.
RN03 - Deve haver itens suficientes no estoque para fazer o produto.


# UC02 - Fazer Pagamento
## Descrição
Realizar o pagamento do pedido.

## Ator principal
Cliente.

## Demais atores
N/C

## Pré-condições
Pedido já criado.
Pagamento status "pendente".

## Pós-condições
O status do pagamento fica "pago".
O sistema emite aviso.

## Origem das informações
Banco de dados da rede;
Usuário;
Sistema de pagamento.

## Usuários responsáveis
N/C

## Pendências
N/C

## Fluxo base
Cliente solicita pagamento;
Cliente usa cupom (opcional);
Cliente paga o pedido;
Sistema de pagamento processa a requisição;
Sistema emite aviso.

## Fluxo alternativo
N/C

## Regras de negócio
RN01 - O pagamento gera pontos quando o programa fidelidade for aceito pelo cliente.


# UC03 - Resgatar Pontos
## Descrição
Resgatar pontos em troca de cupons.

## Ator principal
Cliente.

## Demais atores
N/C

## Pré-condições
Usuário logado.
Programa fidelidade aceito.
Cupom deve estar ativo.

## Pós-condições
O sistema emite aviso.

## Origem das informações
Banco de dados da rede.

## Usuários responsáveis
N/C

## Pendências
N/C

## Fluxo base
Cliente consulta cupons disponíveis;
Cliente solicita o resgate de um cupom por pontos;
Sistema cria uma associação do cupom com o cliente;
Sistema emite aviso.

## Fluxo alternativo
N/C

## Regras de negócio
N/C


# UC04 - Criar Pedido
## Descrição
Criar pedido do cliente.

## Ator principal
Atendente.

## Demais atores
Cliente.

## Pré-condições
Produtos disponíveis em cardápio.
Itens suficientes para preparar o pedido em estoque.

## Pós-condições
Pedido criado com status "cozinha".
Pagamento criado com status "pendente".

## Origem das informações
Banco de dados da rede;
Cliente.

## Usuários responsáveis
N/C

## Pendências
N/C

## Fluxo base
Atendente recebe solicitação de pedido;
Atendente registra pedido no sistema;
Sistema consulta se pedido existe;
Sistema consulta se pedido está ativo;
Sistema consulta se há itens suficientes para fazer os produtos do pedido;
Sistema emite aviso.

## Fluxo alternativo
N/C

## Regras de negócio
N/C


# UC05 - Entregar Pedido
## Descrição
Atendente realiza a entrega do pedido.

## Ator principal
Atendente.

## Demais atores
Cliente.

## Pré-condições
Pedido status "pronto".
Pagamento status "pago".

## Pós-condições
O status do pedido fica "entregue".
O sistema emite aviso.

## Origem das informações
Banco de dados da rede.

## Usuários responsáveis
N/C

## Pendências
N/C

## Fluxo base
Atendente recebe pedido;
Atendente consulta pagamento;
Atendente entrega o pedido;
Atendente dá baixa no sistema;
Sistema emite aviso.

## Fluxo alternativo
N/C

## Regras de negócio
N/C


# UC06 - Preparar Pedido
## Descrição
Prepara os produtos do pedido.

## Ator principal
Cozinha.

## Demais atores
N/C

## Pré-condições
Solicitação de pedido existente.
Itens para fazer os produtos do pedido disponíveis em estoque.

## Pós-condições
O status do pedido fica "pronto".
O sistema emite aviso.

## Origem das informações
Banco de dados da rede.

## Usuários responsáveis
N/C

## Pendências
N/C

## Fluxo base
Cozinha consulta o pedido;
Cozinha obtém os itens dos produtos no estoque;
Cozinha prepara os produtos;
Cozinha atualiza status do pedido para "pronto";
Sistema emite aviso

## Fluxo alternativo
N/C

## Regras de negócio
N/C


# UC07 - Abastecer Estoque
## Descrição
Abastecer os itens do estoque.

## Ator principal
Gerente/Administrador

## Demais atores
N/C

## Pré-condições
O item deve estar registrado no sistema.

## Pós-condições
Sistema emite aviso.

## Origem das informações
Banco de dados.

## Usuários responsáveis
N/C

## Pendências
N/C

## Fluxo base
Ator consulta a existência do item no estoque;
Ator regista o abastecimento do item;
Sistema registra a movimentação do estoque;
Sistema emite aviso

## Fluxo alternativo
N/C

## Regras de negócio
N/C


# UC08 - Criar produto do cardápio
## Descrição
Criar um produto no cardápio da unidade.

## Ator principal
Gerente/Administrador

## Demais atores
N/C

## Pré-condições
Os itens da receita do produto devem existir no estoque.

## Pós-condições
Sistema emite aviso.

## Origem das informações
Banco de dados da rede.

## Usuários responsáveis
N/C

## Pendências
N/C

## Fluxo base
Ator consulta a receita necessária para fazer o produto;
Ator consulta a disponibilidade dos itens no estoque;
Ator cria o produto no cardápio;
Ator registra a receita do produto no sistema;
Sistema emite aviso.

## Fluxo alternativo
N/C

## Regras de negócio
N/C


# UC09 - Processar Pagamento
## Descrição
Processar o pagamento dos clientes.

## Ator principal
Gateway de pagamento.

## Demais atores
N/C

## Pré-condições
Solicitação de pagamento.

## Pós-condições
O sistema atualiza o status do pagamento para "pago" ou "recusado".
O sistema emite aviso.

## Origem das informações
Banco de dados da rede.
Sistema externo de pagamento.

## Usuários responsáveis
N/C

## Pendências
N/C

## Fluxo base
Sistema emite solicitação de pagamento;
Gateway de pagamento processa a solicitação;
Gateway retorna o status da solicitação para o sistema;
Sistema atualiza o status do pagamento;
Sistema emite aviso.

## Fluxo alternativo
N/C

## Regras de negócio
N/C