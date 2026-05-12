# 💡 Ideias de Melhorias e Backlog (MenuVR)

Este documento guarda ideias futuras para evoluir a aplicação. As ideias abaixo foram apresentadas e guardadas para implementação posterior.

## 🍔 Experiência do Cliente (Cardápio / Frontend)
*   **Realidade Aumentada (AR) Nativa:** Ativar o botão nativo do `<model-viewer>` para AR. Botão "Ver na minha mesa", que usa a câmera para projetar o modelo 3D do hambúrguer em tamanho real no ambiente da pessoa.
*   **Carrinho Lateral (Off-canvas):** Quando o cliente clica em "Adicionar", deslizar um painel elegante pela direita da tela mostrando o resumo do pedido (estilo iFood), com a opção de calcular o frete ou selecionar "Retirada" (em vez de usar alertas simples).
*   **Micro-interações (Feedback Tátil):** Usar a API nativa dos navegadores (`navigator.vibrate`) para dar um "Feedback Háptico" (vibração sutil no celular) sempre que o usuário montar o hambúrguer no login ou adicionar algo ao carrinho.

## ⚙️ Painel Administrativo
*   **Gráficos no Dashboard:** Na tela inicial (`admin-dashboard.html`), adicionar gráficos (usando a biblioteca *Chart.js*) mostrando as vendas da semana e um ranking do "Produto mais vendido".
*   **Aviso Sonoro de Novo Pedido:** Um script no Admin que, a cada 30 segundos, verifica se entrou um pedido "Pendente" novo. Se entrar, ele toca um sonoro ("Plim!") para alertar a cozinha/atendente.

## 🛡️ Estrutura e Backend
*   **Integração com WhatsApp:** Quando o cliente finaliza o carrinho, gerar um texto estruturado e redirecionar direto para a API do WhatsApp da lanchonete (`wa.me/numero?text=...`).
*   **Migração para Banco de Dados Real:** Evoluir a estrutura atual baseada em `LocalStorage` para um backend real (como Firebase, Supabase ou Node.js/Express). Isso permitirá que o painel de administração veja os pedidos do cliente em tempo real via WebSockets/Realtime.
