# Jogo Multiplayer em Tempo Real

Um jogo multiplayer simples onde jogadores coletam frutas em uma grade. O primeiro jogador a conectar torna-se o administrador e pode controlar o fluxo do jogo.

## 🎮 Sobre o Jogo

- **Objetivo**: Colete frutas para aumentar sua pontuação
- **Controles**: Use as setas do teclado (↑ ↓ ← →) para mover seu jogador
- **Multiplayer**: Vários jogadores podem jogar simultaneamente em tempo real
- **Admin**: O primeiro jogador conectado tem controles especiais do jogo

## 🏗️ Arquitetura

### Stack Tecnológico

- **Backend**: Node.js + Express + Socket.IO
- **Frontend**: HTML5 Canvas + JavaScript Modules
- **Comunicação**: WebSockets (Socket.IO) para comunicação bidirecional em tempo real

### Estrutura do Projeto

```
tron-game/
├── server.js              # Servidor Node.js com Socket.IO
├── package.json           # Dependências do projeto
└── public/               # Arquivos do cliente
    ├── index.html        # Interface do jogo + lógica do cliente
    ├── game.js           # Lógica do jogo (estado, regras)
    ├── render-screen.js  # Renderização do canvas e placar
    └── keyboard-listener.js  # Captura de input do teclado
```

### Observer Pattern

O jogo utiliza o padrão Observer para sincronização:

- `game.js` notifica observers quando o estado muda
- O servidor se inscreve para replicar mudanças a todos os clientes
- Clientes atualizam sua visão local do estado

## Como Rodar Localmente

### Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn**

### Passo a Passo

1. **Clone o repositório** (se ainda não tiver):

   ```bash
   git clone <url-do-repo>
   cd meu-primeiro-jogo-multiplayer/playground/tron-game
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Inicie o servidor**:

   ```bash
   node server.js
   ```

   Você verá a mensagem:

   ```
   > Server listening on port: 3000
   ```

4. **Abra o jogo no navegador**:

   ```
   http://localhost:3000
   ```

5. **Para testar multiplayer**, abra múltiplas abas/janelas:
   - Primeira aba = Admin (verá painel de controles)
   - Demais abas = Jogadores normais

### Comandos Disponíveis

```bash
# Instalar dependências
npm install

# Rodar o servidor
node server.js

# Rodar em modo de desenvolvimento (se tiver nodemon instalado)
npx nodemon server.js
```

## 📄 Licença

Este é um projeto educacional desenvolvido como parte do aprendizado de desenvolvimento de jogos multiplayer com JavaScript.
