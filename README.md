# Danon - Sistema de Desanonimização Web

**Danon** é uma aplicação web que captura fingerprints (impressões digitais do navegador) dos usuários com o objetivo de identificá-los e exibir suas características técnicas. O sistema utiliza diversas bibliotecas e técnicas para coletar informações como fingerprints do **ThumbmarkJS**, **ClientJS**, e dados de TCP, canvas, áudio, WebGL, entre outros.

## Funcionalidades

- **Captura de Fingerprints**: O sistema captura fingerprints do navegador, como Canvas, TCP, Audio, WebGL, e ThumbmarkJS.
- **Consulta no Banco de Dados**: Quando o usuário acessa o sistema, ele verifica se já existe um registro no banco de dados MongoDB para a mesma fingerprint do ThumbmarkJS e exibe uma mensagem correspondente.
- **Exibição de Dados**: Todos os dados coletados são exibidos em uma tabela organizada por seções: Navegador e Sistema, TCP Fingerprints, ClientJS Fingerprints, ThumbmarkJS Fingerprints e Fingerprints Adicionais.

## Estrutura do Projeto

```plaintext
.
├── public
│   └── js
│       ├── audioFingerprint.js
│       ├── batteryFingerprint.js
│       ├── canvasFingerprint.js
│       ├── mainFingerprint.js
│       ├── tcpFingerprint.js
│       ├── thumbmarkFingerprint.js
│       ├── webGLFingerprint.js
├── server.js
└── views
    ├── index.ejs
    └── response.ejs

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

- Conecta ao MongoDB.
- Recebe e salva os fingerprints enviados pelo cliente.
- Verifica se uma thumbmarkFingerprint já existe no banco de dados.
- Renderiza as páginas usando EJS.

### index.ejs
Arquivo responsável pela exibição dos dados no navegador. Ele exibe os fingerprints coletados em uma tabela, organizados por seções.

### fingerprint.js
Arquivo JavaScript que coleta várias fingerprints do navegador do usuário, como canvas, WebGL, áudio, bateria, TCP, e ThumbmarkJS. Ele também envia esses dados ao servidor.


## Tecnologias Utilizadas
- Node.js: Back-end do projeto.
- MongoDB: Base de dados utilizada para armazenar as fingerprints.
- Express.js: Framework web utilizado no servidor.
- ThumbmarkJS: Biblioteca utilizada para captura de fingerprints.
- ClientJS: Captura de dados adicionais do navegador.
- EJS: Template engine para a renderização das páginas HTML.

## Prints
![image](https://github.com/user-attachments/assets/32e6f3d5-c535-4df2-b18b-859ecb916358)
![image](https://github.com/user-attachments/assets/9010d8d3-7e3a-4379-99fa-c47f963a99a6)
![image](https://github.com/user-attachments/assets/a416bb3b-794a-44ca-a9bb-772885a938bf)

__________

![image](https://github.com/user-attachments/assets/9270abf2-7c00-47d0-a31e-8c8326e7dc4c)
