
# Guia de Configuração do Sistema de Fidelidade

Este guia irá ajudá-lo a configurar o ambiente para executar o Sistema de Fidelidade, incluindo o frontend React e o backend em C# com SQL Server.

## Pré-requisitos

1. **SQL Server Express**
   - [Baixe e instale o SQL Server Express](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads)
   - Certifique-se de que o serviço está rodando

2. **Visual Studio ou .NET SDK**
   - [Baixe o Visual Studio](https://visualstudio.microsoft.com/pt-br/downloads/) (recomendado para desenvolvimento .NET)
   - Ou [Baixe o .NET SDK](https://dotnet.microsoft.com/download) (mínimo versão 7.0)

3. **Node.js**
   - [Baixe e instale o Node.js](https://nodejs.org/) (versão 16 ou superior)

## Configurando o Projeto

### Passo 1: Configurar o Banco de Dados

1. Abra o SQL Server Management Studio ou outro cliente SQL
2. Conecte-se ao seu SQL Server Express local (normalmente `localhost\SQLEXPRESS`)
3. O banco de dados será criado automaticamente quando a API for iniciada pela primeira vez

### Passo 2: Configurar e Iniciar a API (Backend)

1. Navegue até a pasta da API C#:
   ```
   cd public/csharp_api
   ```

2. Verifique se o arquivo `appsettings.json` está configurado com a string de conexão correta:
   - A string de conexão padrão é: `"Server=localhost\\SQLEXPRESS;Database=SistemaFidelidade;Trusted_Connection=True;TrustServerCertificate=True;"`
   - Altere conforme necessário para seu ambiente

3. Instale ferramentas do Entity Framework (caso ainda não tenha):
   ```
   dotnet tool install --global dotnet-ef
   ```

4. Execute a migração inicial para criar o esquema do banco de dados:
   ```
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. Inicie a API:
   ```
   dotnet run
   ```

6. A API estará rodando em `https://localhost:7070`
   - Você pode verificar acessando [https://localhost:7070/swagger](https://localhost:7070/swagger) no navegador

### Passo 3: Iniciar o Frontend

1. No diretório raiz do projeto, instale as dependências:
   ```
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

3. O frontend estará disponível em `http://localhost:5173` (ou outra porta conforme configurado pelo Vite)

## Verificando a Conexão

1. Ao abrir o frontend, você verá uma tela de verificação de conexão com a API
2. Se tudo estiver configurado corretamente, você verá uma mensagem de "API conectada com sucesso!"
3. Caso contrário, verifique:
   - Se a API está rodando em `https://localhost:7070`
   - Se não há problemas no SQL Server
   - Se as configurações de CORS estão corretas

## Credenciais de Acesso

### Administrador (padrão)
- Usuário: `Admin`
- Senha: `1234`

## Solução de Problemas

### CORS não permitido
- Verifique se o frontend está rodando em uma origem permitida no arquivo `appsettings.json` da API
- As origens permitidas por padrão são: `localhost:5173`, `localhost:3000`, `localhost:8080`, etc.

### Erro de conexão com banco de dados
- Verifique se o SQL Server está rodando
- Confirme se a string de conexão está correta para seu ambiente

### A API não está respondendo
- Certifique-se de que está executando o comando na pasta correta
- Verifique se as portas não estão sendo usadas por outros aplicativos

### Problemas de autenticação
- Limpe os dados do navegador (localStorage) se estiver tendo problemas persistentes de login
