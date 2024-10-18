# Danon - Sistema de Desanonimização Web

**Danon** é uma aplicação web que captura fingerprints (impressões digitais do navegador) dos usuários com o objetivo de identificá-los e exibir suas características técnicas. O sistema utiliza diversas bibliotecas e técnicas para coletar informações como fingerprints do **ThumbmarkJS**, **ClientJS**, e dados de TCP, canvas, áudio, WebGL, entre outros.

## Funcionalidades

- **Captura de Fingerprints**: O sistema captura fingerprints do navegador, como Canvas, TCP, Audio, WebGL, e ThumbmarkJS.
- **Consulta no Banco de Dados**: Quando o usuário acessa o sistema, ele verifica se já existe um registro no banco de dados MongoDB para a mesma fingerprint do ThumbmarkJS e exibe uma mensagem correspondente.
- **Exibição de Dados**: Todos os dados coletados são exibidos em uma tabela organizada por seções: Navegador e Sistema, TCP Fingerprints, ClientJS Fingerprints, ThumbmarkJS Fingerprints e Fingerprints Adicionais.

## Estrutura do Projeto

```bash
.
├── package.json
├── package-lock.json
├── public
│   └── js
│       └── fingerprint.js
├── server.js
└── views
    ├── index.ejs
    └── response.ejs

- package.json: Arquivo de dependências e metadados do projeto Node.js.
- public/js/fingerprint.js: Script responsável pela coleta dos dados de fingerprint no frontend.
- server.js: Script principal do servidor que lida com o armazenamento das fingerprints e consulta no MongoDB.
- views/index.ejs: Página de exibição das fingerprints coletadas.
- views/response.ejs: Página de resposta ou confirmação (pode ser personalizada conforme necessidade).
