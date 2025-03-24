
-- Sistema de Fidelidade Database Schema for SQL Server

-- Create Database
CREATE DATABASE SistemaFidelidade;
GO

USE SistemaFidelidade;
GO

-- Create Clients Table
CREATE TABLE Clientes (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Nome NVARCHAR(100) NOT NULL,
    CPF NVARCHAR(14) NOT NULL UNIQUE,
    Email NVARCHAR(100),
    Telefone NVARCHAR(20) NOT NULL,
    Pontos INT NOT NULL DEFAULT 0,
    DataCadastro DATETIME NOT NULL DEFAULT GETDATE(),
    SenhaSalt NVARCHAR(128),
    SenhaHash NVARCHAR(128),
    TokenRecuperacao NVARCHAR(128),
    TokenExpiracao DATETIME,
    UltimoAcesso DATETIME
);
GO

-- Create Purchases Table
CREATE TABLE Compras (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ClienteId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Clientes(Id) ON DELETE CASCADE,
    Valor DECIMAL(10, 2) NOT NULL,
    Pontos INT NOT NULL,
    Data DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- Create Admins Table
CREATE TABLE Administradores (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Nome NVARCHAR(100) NOT NULL,
    Usuario NVARCHAR(20) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    SenhaSalt NVARCHAR(128) NOT NULL,
    SenhaHash NVARCHAR(128) NOT NULL,
    DataCadastro DATETIME NOT NULL DEFAULT GETDATE(),
    TokenRecuperacao NVARCHAR(128),
    TokenExpiracao DATETIME,
    UltimoAcesso DATETIME
);
GO

-- Create Point Redemptions Table
CREATE TABLE ResgatePontos (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ClienteId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Clientes(Id) ON DELETE CASCADE,
    PontosResgatados INT NOT NULL,
    Descricao NVARCHAR(255) NOT NULL,
    Data DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- Create System Logs Table
CREATE TABLE LogsSistema (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UsuarioId UNIQUEIDENTIFIER, -- Can be NULL for system events
    TipoUsuario NVARCHAR(20) NOT NULL, -- 'Admin' or 'Cliente'
    Acao NVARCHAR(255) NOT NULL,
    Detalhes NVARCHAR(MAX),
    Timestamp DATETIME NOT NULL DEFAULT GETDATE(),
    IP NVARCHAR(50)
);
GO

-- Create index for faster searches
CREATE INDEX IX_Clientes_CPF ON Clientes(CPF);
CREATE INDEX IX_Compras_ClienteId ON Compras(ClienteId);
CREATE INDEX IX_Compras_Data ON Compras(Data);
CREATE INDEX IX_ResgatePontos_ClienteId ON ResgatePontos(ClienteId);
GO

-- Create Stored Procedure for Password Reset
CREATE PROCEDURE sp_GerarTokenRecuperacao
    @CPF NVARCHAR(14),
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ClienteId UNIQUEIDENTIFIER;
    DECLARE @Token NVARCHAR(128);
    
    -- Check if client exists with matching CPF and Email
    SELECT @ClienteId = Id FROM Clientes WHERE CPF = @CPF AND Email = @Email;
    
    IF @ClienteId IS NOT NULL
    BEGIN
        -- Generate a random token
        SET @Token = CONVERT(NVARCHAR(128), NEWID()) + CONVERT(NVARCHAR(128), NEWID());
        
        -- Set token expiration to 24 hours
        UPDATE Clientes
        SET TokenRecuperacao = @Token,
            TokenExpiracao = DATEADD(HOUR, 24, GETDATE())
        WHERE Id = @ClienteId;
        
        -- Return the token
        SELECT @Token AS Token, @Email AS Email;
        
        -- Log the password reset request
        INSERT INTO LogsSistema (UsuarioId, TipoUsuario, Acao, Detalhes)
        VALUES (@ClienteId, 'Cliente', 'Solicitação de Recuperação de Senha', 'Token gerado com sucesso');
    END
    ELSE
    BEGIN
        -- Return empty result
        SELECT NULL AS Token, NULL AS Email;
    END
END;
GO

-- Create Stored Procedure for Validating Reset Token
CREATE PROCEDURE sp_ValidarTokenRecuperacao
    @Token NVARCHAR(128)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ClienteId UNIQUEIDENTIFIER;
    DECLARE @TokenValido BIT = 0;
    
    -- Check if token exists and is valid
    SELECT @ClienteId = Id 
    FROM Clientes 
    WHERE TokenRecuperacao = @Token 
    AND TokenExpiracao > GETDATE();
    
    IF @ClienteId IS NOT NULL
    BEGIN
        SET @TokenValido = 1;
    END
    
    -- Return result
    SELECT @TokenValido AS TokenValido, @ClienteId AS ClienteId;
END;
GO

-- Create Stored Procedure for Updating Password
CREATE PROCEDURE sp_AtualizarSenha
    @Token NVARCHAR(128),
    @SenhaSalt NVARCHAR(128),
    @SenhaHash NVARCHAR(128)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ClienteId UNIQUEIDENTIFIER;
    DECLARE @Sucesso BIT = 0;
    
    -- Check if token exists and is valid
    SELECT @ClienteId = Id 
    FROM Clientes 
    WHERE TokenRecuperacao = @Token 
    AND TokenExpiracao > GETDATE();
    
    IF @ClienteId IS NOT NULL
    BEGIN
        -- Update password and clear token
        UPDATE Clientes
        SET SenhaSalt = @SenhaSalt,
            SenhaHash = @SenhaHash,
            TokenRecuperacao = NULL,
            TokenExpiracao = NULL
        WHERE Id = @ClienteId;
        
        SET @Sucesso = 1;
        
        -- Log the password update
        INSERT INTO LogsSistema (UsuarioId, TipoUsuario, Acao, Detalhes)
        VALUES (@ClienteId, 'Cliente', 'Senha Atualizada', 'Senha atualizada com sucesso via token de recuperação');
    END
    
    -- Return result
    SELECT @Sucesso AS Sucesso;
END;
GO

-- Create default admin account
INSERT INTO Administradores (Nome, Usuario, Email, SenhaSalt, SenhaHash, DataCadastro)
VALUES ('Administrador', 'admin', 'admin@sistemafidelidade.com', 'salt-value', 'hash-value', GETDATE());
GO
