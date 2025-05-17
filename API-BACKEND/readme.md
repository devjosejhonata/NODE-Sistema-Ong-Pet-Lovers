# 🐾 API - ONG Pet Lovers

API desenvolvida em **Node.js com NestJS** para gerenciamento de dados de uma ONG voltada ao cuidado e adoção de pets. Este repositório contém a estrutura backend da aplicação, com base modular, orientada a boas práticas e pronta para evoluir com persistência em banco de dados, autenticação e mais.

# 🚀 Como rodar o projeto:

- npm start
- http://localhost:3000

# 📁 Estrutura Geral da API:

- src/
- ├── config/           # Configurações gerais da aplicação (dentro de .gitignore para preservar dados sensiveis)
- ├── controllers/      # Camada que recebe e responde às requisições HTTP
- ├── dtos/             # (A ser implementado se necessário) - Objetos de transferência de dados
- ├── models/           # Representação das entidades da aplicação (ex: Endereco)
- ├── modules/          # Organização dos módulos da aplicação (ex: EnderecoModule)
- ├── repository/       # Comunicação com banco de dados
- ├── services/         # Camada de lógica de negócio (ex: EnderecoService)
- ├── utils/            # Funções auxiliares

# ✅ Funcionalidades atuais:

- ✅ Entidade implementada: Endereco
- ✅ Configuração e Comunicação com banco SQLServer feitas
- ✅ Reutilização de códigos e separaçao de responsabilidades
- ✅ Servidor rodando com sucesso

# 🛠 Tecnologias utilizadas:

- Node.js
- NestJS
- Typescript

# 📌 Próximos passos:

- ➕ Implementar Novas entidades (Abrigo, Admin, Adotante, Pet.)

# 📄 Licença:

Projeto próprio, desenvolvido de ponta a ponta unicamente por mim, josé jhonata.

