
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SistemaFidelidade.API.Data;
using SistemaFidelidade.API.Models;
using System;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SistemaFidelidade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordResetController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _emailFrom;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;

        public PasswordResetController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _emailFrom = _configuration["EmailSettings:From"];
            _smtpServer = _configuration["EmailSettings:SmtpServer"];
            _smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]);
            _smtpUsername = _configuration["EmailSettings:Username"];
            _smtpPassword = _configuration["EmailSettings:Password"];
        }

        // DTO para requisição de recuperação de senha
        public class PasswordResetRequestDto
        {
            public string CPF { get; set; }
            public string Email { get; set; }
        }

        // DTO para validação de token
        public class ValidateTokenDto
        {
            public string Token { get; set; }
        }

        // DTO para atualização de senha
        public class ResetPasswordDto
        {
            public string Token { get; set; }
            public string NewPassword { get; set; }
        }

        [HttpPost("request")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequestDto request)
        {
            try
            {
                // Buscar cliente com CPF e email correspondentes
                var cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.CPF == request.CPF && c.Email == request.Email);

                if (cliente != null)
                {
                    // Gerar token de recuperação
                    string token = GenerateResetToken();
                    
                    // Definir validade de 24 horas
                    cliente.TokenRecuperacao = token;
                    cliente.TokenExpiracao = DateTime.Now.AddHours(24);
                    
                    await _context.SaveChangesAsync();

                    // Registrar log
                    _context.LogsSistema.Add(new LogSistema
                    {
                        UsuarioId = cliente.Id,
                        TipoUsuario = "Cliente",
                        Acao = "Solicitação de Recuperação de Senha",
                        Detalhes = "Token gerado com sucesso"
                    });
                    await _context.SaveChangesAsync();

                    // Enviar email com o token
                    await SendPasswordResetEmail(cliente.Email, token);
                    return Ok(new { message = "Um e-mail de recuperação de senha foi enviado para o endereço cadastrado." });
                }
                else
                {
                    // Não informamos o motivo exato por segurança
                    return BadRequest(new { message = "Não foi possível processar a solicitação. Verifique os dados informados." });
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { message = "Ocorreu um erro ao processar a solicitação." });
            }
        }

        [HttpPost("validate-token")]
        public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenDto request)
        {
            try
            {
                // Verificar se token existe e é válido
                var cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.TokenRecuperacao == request.Token && c.TokenExpiracao > DateTime.Now);

                if (cliente != null)
                {
                    return Ok(new { isValid = true });
                }
                else
                {
                    return BadRequest(new { isValid = false, message = "Token inválido ou expirado." });
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { message = "Ocorreu um erro ao validar o token." });
            }
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            try
            {
                // Buscar cliente pelo token
                var cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.TokenRecuperacao == request.Token && c.TokenExpiracao > DateTime.Now);

                if (cliente != null)
                {
                    // Generate salt and hash for the new password
                    string salt = GenerateSalt();
                    string hash = ComputeHash(request.NewPassword, salt);

                    // Atualizar senha e limpar token
                    cliente.SenhaSalt = salt;
                    cliente.SenhaHash = hash;
                    cliente.TokenRecuperacao = null;
                    cliente.TokenExpiracao = null;
                    
                    await _context.SaveChangesAsync();

                    // Registrar log
                    _context.LogsSistema.Add(new LogSistema
                    {
                        UsuarioId = cliente.Id,
                        TipoUsuario = "Cliente",
                        Acao = "Senha Atualizada",
                        Detalhes = "Senha atualizada com sucesso via token de recuperação"
                    });
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Senha atualizada com sucesso." });
                }
                else
                {
                    return BadRequest(new { message = "Não foi possível atualizar a senha. Token inválido ou expirado." });
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { message = "Ocorreu um erro ao atualizar a senha." });
            }
        }

        // Helper method to generate a reset token
        private string GenerateResetToken()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray()) + 
                   Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }

        // Helper method to send password reset email
        private async Task SendPasswordResetEmail(string email, string token)
        {
            string resetLink = $"{Request.Scheme}://{Request.Host}/recuperar-senha?token={token}";

            string subject = "Recuperação de Senha - Sistema de Fidelidade";
            string body = $@"
                <html>
                <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
                    <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>
                        <h2 style='color: #4CAF50;'>Recuperação de Senha</h2>
                        <p>Você solicitou a recuperação de senha para o Sistema de Fidelidade.</p>
                        <p>Clique no botão abaixo para criar uma nova senha:</p>
                        <p style='text-align: center;'>
                            <a href='{resetLink}' style='display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Redefinir Senha</a>
                        </p>
                        <p>Se você não solicitou esta recuperação, ignore este e-mail.</p>
                        <p>Este link expirará em 24 horas.</p>
                        <p>Atenciosamente,<br>Equipe do Sistema de Fidelidade</p>
                    </div>
                </body>
                </html>";

            using (var message = new MailMessage())
            {
                message.From = new MailAddress(_emailFrom);
                message.To.Add(new MailAddress(email));
                message.Subject = subject;
                message.Body = body;
                message.IsBodyHtml = true;

                using (var client = new SmtpClient(_smtpServer, _smtpPort))
                {
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
                    client.EnableSsl = true;
                    await client.SendMailAsync(message);
                }
            }
        }

        // Helper method to generate a random salt
        private string GenerateSalt()
        {
            byte[] saltBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }

        // Helper method to compute a password hash
        private string ComputeHash(string password, string salt)
        {
            using (var sha256 = SHA256.Create())
            {
                string passwordWithSalt = password + salt;
                byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(passwordWithSalt));
                return Convert.ToBase64String(hashBytes);
            }
        }
    }
}
