# Danon - Sistema de Desanonimização Web

**Danon** é uma aplicação web que captura fingerprints (impressões digitais do navegador) dos usuários com o objetivo de identificá-los e exibir suas características técnicas. O sistema utiliza diversas bibliotecas e técnicas para coletar informações como fingerprints do **ThumbmarkJS**, **ClientJS**, e dados de TCP, canvas, áudio, WebGL, entre outros.

## Funcionalidades

- **Captura de Fingerprints**: O sistema captura fingerprints do navegador, como Canvas, TCP, Audio, WebGL, e ThumbmarkJS.
- **Identificador Personalizável**: Ao acessar o sistema, o usuário pode escolher qual identificador será usado para identificá-lo entre as seguintes opções:
-- thumbmarkFingerprint
-- clientIP (TCP Fingerprint)
-- fingerprint (ClientJS Fingerprint)
-- canvasFingerprint
Por padrão, o sistema usa o thumbmarkFingerprint, mas o usuário pode selecionar outro identificador na interface.
- **Consulta no Banco de Dados**: Quando o usuário acessa o sistema, o servidor verifica se já existe um registro no banco de dados MongoDB para o identificador selecionado e exibe uma mensagem correspondente.
- **Exibição de Dados**: Todos os dados coletados são exibidos em uma tabela organizada por seções que podem ser expandidas ou comprimidas: Navegador e Sistema, TCP Fingerprints, ClientJS Fingerprints, ThumbmarkJS Fingerprints e Fingerprints Adicionais.
- **Visualização de Registros Anteriores**: Se houver registros anteriores para o identificador selecionado, o sistema permite que o usuário visualize as últimas 5 fingerprints associadas a esse identificador. Na página de visualização, o identificador escolhido é destacado para facilitar a identificação.

## Estrutura do Projeto

```plaintext
.
├── public
│   ├── css
│   │   ├── index.css
│   │   └── view-records.css
│   ├── js
│   │   ├── audioFingerprint.js
│   │   ├── batteryFingerprint.js
│   │   ├── canvasFingerprint.js
│   │   ├── mainFingerprint.js
│   │   ├── tcpFingerprint.js
│   │   ├── thumbmarkFingerprint.js
│   │   ├── webGLFingerprint.js
│   │   └── client.min.js (ClientJS)
│   └── images
│       └── ... (imagens utilizadas no projeto)
├── server.js
└── views
    ├── index.ejs
    └── view-records.ejs


```
## Arquivos de Fingerprinting
Os módulos de coleta de fingerprint foram divididos para facilitar a manutenção do código e garantir a modularização. A seguir, uma descrição de cada módulo:

- canvasFingerprint.js: Responsável por capturar a fingerprint usando o elemento canvas do HTML5.
- audioFingerprint.js: Captura a fingerprint baseada em uma análise do sinal de áudio gerado.
- webGLFingerprint.js: Gera a fingerprint baseada em dados WebGL do navegador.
- batteryFingerprint.js: Coleta informações da bateria do dispositivo do usuário.
- tcpFingerprint.js: Faz uma requisição à API Zardaxt para obter dados de fingerprint via TCP.
- thumbmarkFingerprint.js: Coleta a fingerprint utilizando a biblioteca ThumbmarkJS.
- mainFingerprint.js: Arquivo principal que integra todos os módulos acima e coordena o envio das fingerprints ao servidor.

## Requisitos
Certifique-se de que você tem os seguintes softwares instalados em seu sistema:

- Node.js (v14 ou superior)
- MongoDB (em execução localmente ou via Docker)
- Git (para clonar o repositório)
- Docker (opcional, para executar o MongoDB via Docker)

## Como Instalar
Siga os passos abaixo para baixar e executar o projeto Danon em seu computador:

1. Clonar o repositório
- Primeiro, clone o repositório em seu computador usando o comando:
```bash
git clone https://github.com/seu-usuario/danon.git
```
2. Instalar as dependências
- Entre no diretório do projeto e instale as dependências do Node.js:
```bash
cd danon
npm install
```
3. Configurar o MongoDB

- Se você não tem o MongoDB instalado, você pode rodar uma instância via Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```
O banco de dados MongoDB precisa estar em execução na porta 27017.

4. Executar o projeto
- Inicie o servidor Node.js com o seguinte comando:
```bash
node server.js
```
O servidor será iniciado na porta 3000 e estará disponível no endereço:
```bash
http://localhost:3000
```
5. Testar o sistema
- Abra seu navegador e acesse a URL fornecida. A aplicação exibirá as fingerprints coletadas e verificará se existem registros prévios no banco de dados.


## Estrutura do Código

### server.js
Este arquivo contém toda a lógica do servidor. Ele:

- Conecta ao MongoDB e define o esquema de dados.
- Recebe e salva as fingerprints enviadas pelo cliente.
- Verifica se já existem registros anteriores para o identificador selecionado.
- Renderiza as páginas usando EJS.
- Permite que o usuário visualize os registros anteriores associados ao identificador escolhido

### index.ejs
Arquivo responsável pela interface principal da aplicação. Ele:

- Exibe um campo de seleção onde o usuário pode escolher o identificador a ser utilizado.
- Mostra as fingerprints coletadas em uma tabela organizada por seções que podem ser expandidas ou comprimidas.
- Exibe mensagens informando se existem registros anteriores para o identificador selecionado.
- Permite ao usuário visualizar os últimos registros caso existam.

### view-records.ejs
Esta página exibe os últimos 5 registros associados ao identificador selecionado. Características:

- Destaca o identificador escolhido nos registros exibidos.
- Apresenta os dados de forma organizada, facilitando a comparação entre os registros.
- Inclui um botão para voltar à página inicial.

### Arquivos de Fingerprint
Os arquivos JavaScript em public/js/ são responsáveis por coletar diversas fingerprints do navegador do usuário:

- audioFingerprint.js
- batteryFingerprint.js
- canvasFingerprint.js
- webGLFingerprint.js
- tcpFingerprint.js
- thumbmarkFingerprint.js
- mainFingerprint.js
O arquivo mainFingerprint.js é o ponto central que coordena a coleta das fingerprints e o envio dos dados ao servidor.

### CSS
Os arquivos CSS em public/css/ definem o estilo das páginas:

- index.css: Estilos para a página principal (index.ejs).
- view-records.css: Estilos para a página de visualização de registros (view-records.ejs).

## Tecnologias Utilizadas
- Node.js: Back-end do projeto.
- Express.js: Framework web utilizado no servidor.
- MongoDB: Base de dados utilizada para armazenar as fingerprints.
- EJS: Template engine para a renderização das páginas HTML.
- ThumbmarkJS: Biblioteca utilizada para captura de fingerprints.
- ClientJS: Biblioteca para captura de dados adicionais do navegador.
- Docker: Para facilitar a execução do MongoDB em ambientes de desenvolvimento.
- JavaScript (ES6): Utilizado no front-end e back-end.
- CSS: Estilização das páginas web.
