
# Sistema de Fidelidade - API C# com Entity Framework

## Requisitos
- .NET 7.0 SDK
- SQL Server Express ou SQL Server

## Configuração

1. Certifique-se de ter o .NET 7.0 SDK instalado
2. Configure a conexão do banco de dados em `appsettings.json`
3. Execute os seguintes comandos na pasta do projeto:

```bash
# Instalar Entity Framework Core tools
dotnet tool install --global dotnet-ef

# Criar as migrations iniciais
dotnet ef migrations add InitialCreate

# Aplicar as migrations no banco de dados
dotnet ef database update

# Executar a API
dotnet run
```

## Endpoints Principais

- `POST /api/AdminAuth/login` - Login de administrador
- `GET /api/Clientes` - Listar todos os clientes
- `GET /api/Clientes/{id}` - Obter cliente por ID
- `POST /api/Clientes` - Criar novo cliente
- `PUT /api/Clientes/{id}` - Atualizar cliente
- `DELETE /api/Clientes/{id}` - Excluir cliente
- `POST /api/PasswordReset/request` - Solicitar recuperação de senha
- `POST /api/PasswordReset/validate-token` - Validar token de recuperação
- `POST /api/PasswordReset/reset` - Redefinir senha

## Autenticação

A API usa autenticação JWT (JSON Web Token). Após o login, o token recebido deve ser incluído no cabeçalho `Authorization` de todas as requisições que requerem autenticação:

```
Authorization: Bearer {seu-token-aqui}
```

O usuário administrador padrão é:
- Usuário: Admin
- Senha: 1234
