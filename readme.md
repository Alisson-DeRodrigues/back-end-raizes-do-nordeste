# BACK-END RAÍZES DO NORDESTE
## Descrição
Raízes do Nordeste é uma rede de restaurante que enfrenta desafios de administração com a expansão do négocio.
A solução apresentada visa sanar as dificuldades, ela é o back-end do négocio responsável por realizar cadastros de clientes, logins com rota segura, consultar cardápios, criar pedidos, gerenciar estoque, aplicar cupons, realizar pagamentos e outras funcionalidades. Ela utiliza Node.js com typescript como servidor e PostgreSQL como banco de dados.

## Requisitos de software
- node v24.15.0
- npm v11.12.1
- PostgreSQL 17.9

## Instalar dependências do node
```shell
npm install
```

## Popular banco de dados
[Tabelas](https://github.com/Alisson-DeRodrigues/back-end-raizes-do-nordeste/blob/main/src/docs/database/tabelas.sql)
[Dados](https://github.com/Alisson-DeRodrigues/back-end-raizes-do-nordeste/blob/main/src/docs/database/dados.sql)

## Sobre dados importados
A solução acompanha dados para popular o banco de dados e facilitar os testes.

### Principais:

*Unidade:*
- nome: Olívia Flores - Vitória da Conquista
- id: 22222222-2222-2222-2222-222222222222

*Usuários:*
- role: admin
- email: admin@restaurante.com
- senha: teste
<hr>

- role: cozinha
- email: cozinha@restaurante.com
- senha: teste
<hr>

- role: atendente
- email: atendimento@restaurante.com
- senha: teste
<hr>

- role: cliente
- email: cliente@email.com
- senha: teste

*Produtos:*
- nome: Baião de Dois Especial
- id: cccccccc-0000-0000-0000-000000000001
<hr>

- nome: carajé Completo (Unidade)
- id: cccccccc-0000-0000-0000-000000000002