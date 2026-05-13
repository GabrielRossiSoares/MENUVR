# ATUALIZAÇÃO DA DOCUMENTAÇÃO DO PROJETO (MENUVR)

Com base nas páginas mais recentes que criamos, aqui estão os trechos do seu documento (`MenuVR_Documentacao_ABNT.docx`) que precisam ser revisados e atualizados. Você pode copiar esses textos e colar no seu arquivo Word.

---

## 1.3 ESCOPO E DELIMITAÇÕES (ATUALIZADO)
O sistema será composto por dois módulos principais:
*   **Módulo Cliente:** visualização do cardápio, detalhes do produto, visualização 3D, e acompanhamento do status do pedido em tempo real. A tela de login apresenta uma experiência interativa gamificada.
*   **Módulo Administrador:** autenticação, CRUD do cardápio (produtos, categorias e adicionais), gestão de pedidos através de um Kanban interativo com impressão de cupom térmico, e painel de configurações (temas visuais, acessibilidade e gestão de acessos).

**Não fazem parte do escopo desta versão:**
*   Pagamentos online e integrações com gateways de pagamento.
*   Gestão de mesas, delivery (rastreio de motoboy) e controle avançado de estoque.
*   Emissão de nota fiscal.

---

## 3 VISÃO GERAL DO SISTEMA (ATUALIZADO)
### 3.1 MÓDULO CLIENTE
*   Acesso ao sistema por meio de uma tela de login inovadora e interativa ("Smashed Burger").
*   Acesso ao cardápio por link e/ou QR Code.
*   Listagem de categorias e produtos (nome, preço, descrição e imagem).
*   Tela de detalhes com visualização 3D (rotacionar e zoom).
*   Rastreamento do status do pedido (Pendente, Em Preparo, Pronto) pelo cliente.

### 3.2 MÓDULO ADMINISTRADOR
*   Login do administrador.
*   Gestão de Pedidos através de um painel visual (estilo Kanban) com atualização de status.
*   Geração de cupom para impressão térmica, facilitando o trabalho da cozinha.
*   Cadastro e edição de categorias, produtos (incluindo upload de imagem e arquivo 3D) e adicionais.
*   Ativar/desativar produtos para controle de disponibilidade.
*   Painel de Configurações para gestão de usuários administradores, ajustes de acessibilidade e alternância de temas (Claro/Escuro).

---

## 4.1 REQUISITOS FUNCIONAIS (ADICIONAR NA TABELA EXISTENTE)

| ID | Nome | Descrição resumida |
| :--- | :--- | :--- |
| **RF009** | **Gerenciar Pedidos (Kanban)** | Administrador visualiza pedidos recebidos e altera o status (Pendente -> Em Preparo -> Pronto) através de um painel Kanban. |
| **RF010** | **Imprimir Cupom Térmico** | Administrador gera um cupom de impressão amigável para impressoras térmicas contendo os itens do pedido e dados do cliente. |
| **RF011** | **Rastrear Status do Pedido** | Cliente acompanha a mudança de status do seu pedido de forma visual (linha do tempo). |
| **RF012** | **Configurar Sistema** | Administrador cadastra novos usuários gerenciais e altera as configurações globais de tema (Claro/Escuro). |
| **RF013** | **Login Interativo** | Cliente realiza a autenticação mediante uma tela que possui interatividade lúdica (montagem de hambúrguer). |

---

## 4.2 REQUISITOS NÃO FUNCIONAIS (ADICIONAR/ATUALIZAR)

| ID | Nome | Descrição |
| :--- | :--- | :--- |
| **RNF006** | **Suporte a Temas** | O sistema deve suportar as opções de Tema Claro e Tema Escuro. |
| **RNF007** | **Prontidão para Impressão** | Telas de cupom devem ser formatadas sem elementos gráficos de fundo para garantir boa impressão térmica. |

---

## 5 PROTOTIPAÇÃO DE TELAS (ATUALIZADO)

**5.1 TELAS DO MÓDULO CLIENTE**
*   **Login Interativo Split (Novo):** Tela dividida com elemento 3D/CSS de montagem do hambúrguer e formulário.
*   Cardápio (listagem).
*   Tela de detalhes do produto (imagem, descrição e botão para 3D).
*   Visualização 3D do produto (Three.js).
*   **Status do Pedido (Novo):** Tela de acompanhamento do andamento do pedido pelo cliente.

**5.2 TELAS DO MÓDULO ADMINISTRADOR**
*   Login do administrador.
*   Dashboard (listagem de produtos e KPIs).
*   **Gestão de Pedidos (Novo):** Quadro Kanban (Pendente, Em Preparo, Pronto).
*   Cadastro/Edição de produto.
*   Cadastro/Edição de categoria e Adicionais.
*   **Configurações do Sistema (Novo):** Cadastro de funcionários e configurações visuais.

---

## 7.3 CASOS DE USO (RESUMO - ADICIONAR)
*   **UC07** - Gerenciar Status do Pedido no Kanban
*   **UC08** - Imprimir Comprovante de Pedido
*   **UC09** - Acompanhar Andamento do Pedido (Cliente)
*   **UC10** - Configurar Temas e Usuários Administradores

---

> **Dica para o Word:** Lembre-se de atualizar o seu **Sumário** no Word assim que colar esses novos tópicos!
