# Back-End Raízes do Nordeste
## Descrição
Raízes do Nordeste é uma rede de restaurantes em expansão que enfrenta desafios operacionais, tecnológicos e organizacionais.

Esta solução corresponde ao back-end da aplicação, responsável por gerenciar as regras de negócio do restaurante. A API conta com cadastro e login, consulta de cardápios, criação de pedidos, gerenciamento de estoque, aplicação de cupons de desconto, processamento de pagamentos e muito mais.

---

## Requisitos
* **Node.js** (v24.15.0 ou superior)
* **npm** (v11.12.1 ou superior)
* **PostgreSQL** (v17.9 ou superior)

A solução utiliza Node.js com typescript como servidor e o Postgresql como banco de dados.

---

## Como executar o projeto
### 1. Clonar repositório
```shell
git clone https://github.com/Alisson-DeRodrigues/back-end-raizes-do-nordeste.git
```

---

### 2. Instalar dependências
```shell
npm install
```

---

### 3. Criar banco de dados
Abra a interface gráfica do Postgresql ou entre no Postgresql via terminal.
```sql
CREATE DATABASE raizesdonordeste;
```

---

### 4. Popular o banco de dados
Conecte-se ao banco de dados.
```shell
\c raizesdonordeste
```
Depois execute os comandos sql de [Tabelas](https://github.com/Alisson-DeRodrigues/back-end-raizes-do-nordeste/blob/main/src/docs/database/tabelas.sql) e [Dados](https://github.com/Alisson-DeRodrigues/back-end-raizes-do-nordeste/blob/main/src/docs/database/dados.sql)

---

### 5. Configurar .env
```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/raizesdonordeste"
PORT=3000
JWT_SECRET=senhasegura
```
---

### 6. Iniciar servidor
```
npm run dev
```

---

## Dados de teste
O arquivo [Dados](https://github.com/Alisson-DeRodrigues/back-end-raizes-do-nordeste/blob/main/src/docs/database/dados.sql) acompanha registros para facilitar os testes.
### Unidades
| Nome da Unidade | ID (UUID) |
| :--- | :-- |
| Olívia Flores - Vitória da Conquista | 22222222-2222-2222-2222-222222222222 |

---

### Usuários
| Permissão (Role) | E-mail | Senha |
| :--- | :--- | :--- |
| Admin | admin@restaurante.com | teste |
| Cozinha | cozinha@restaurante.com | teste |
| Atendente | atendimento@restaurante.com | teste |
| Cliente | cliente@email.com | teste |

---

### Produtos
| Nome do Produto | ID (UUID) |
| :--- | :--- |
| Baião de Dois Especial | cccccccc-0000-0000-0000-000000000001 |
| Acarajé Completo (Unidade) | cccccccc-0000-0000-0000-000000000002 |

---

## Documentação de rotas - SWAGGER
Acesse a rota /api-docs para acessar a documentação do Swagger.

---

## Coleção de testes com Postman
### Requisitos
Arquivo Collection com as rotas/testes
- [Link Github](https://github.com/Alisson-DeRodrigues/back-end-raizes-do-nordeste/blob/main/src/docs/Postman/API%20-%20Ra%C3%ADzes%20do%20Nordeste.postman_collection.json)
- [Link Oficial](https://alisson-5450299.postman.co/workspace/Alisson's-Workspace~b8b95af7-72bb-4818-82f4-9c4a9dc71c73/collection/46634291-a1bac9fb-33dc-443c-be73-12af41bf61d7?action=share&source=copy-link&creator=46634291)

Arquivo Environment com as variáveis ambiente
- [Link Github](https://github.com/Alisson-DeRodrigues/back-end-raizes-do-nordeste/blob/main/src/docs/Postman/API%20-%20Ra%C3%ADzes%20do%20Nordeste.postman_environment.json)
- [Link Oficial](https://alisson-5450299.postman.co/workspace/Alisson's-Workspace~b8b95af7-72bb-4818-82f4-9c4a9dc71c73/environment/46634291-f84d981f-63be-4aa6-8de4-cf03498eb91d?action=share&source=copy-link&creator=46634291)

---

### Configurando variáveis ambiente manualmente
Caso optar por não importar o arquivo de environment, duas variáveis devem ser configuradas para utilizar a collection, pois as rotas utilizam variáveis ambiente na composição.

| Variable | Value |
| :--- | :--- |
| BASE_URL | http://localhost:3000 |
| UNIDADE_ID | 22222222-2222-2222-2222-222222222222 |

---

### Executando testes fora do ambiente local
Altere o valor da variável ambiente BASE_URL para o seu link externo.

| Variable | Value |
| :--- | :--- |
| BASE_URL | https://seulink.com |

---

### Executando testes no Postman
Os testes estão organizados em pastas de forma que um teste não precisa de uma ação anterior para executar. Passe o mouse sobre o teste, clique nos três pontinhos e selecione run para executar o teste.

![Exemplo teste no Postman](https://github.com/Alisson-DeRodrigues/back-end-raizes-do-nordeste/blob/main/src/docs/Exemplo%20de%20teste.png)
![alt text](src/docs/Exemplo de teste.png)