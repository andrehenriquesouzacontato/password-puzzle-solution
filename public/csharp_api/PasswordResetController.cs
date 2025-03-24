
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
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
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _emailFrom;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;

        public PasswordResetController(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
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
                string token = null;
                string email = null;

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("sp_GerarTokenRecuperacao", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@CPF", request.CPF);
                        command.Parameters.AddWithValue("@Email", request.Email);

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                token = reader["Token"].ToString();
                                email = reader["Email"].ToString();
                            }
                        }
                    }
                }

                if (token != null && email != null)
                {
                    // Enviar email com o token
                    await SendPasswordResetEmail(email, token);
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
                bool isValid = false;
                Guid clientId = Guid.Empty;

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("sp_ValidarTokenRecuperacao", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@Token", request.Token);

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                isValid = Convert.ToBoolean(reader["TokenValido"]);
                                if (!reader.IsDBNull(reader.GetOrdinal("ClienteId")))
                                {
                                    clientId = Guid.Parse(reader["ClienteId"].ToString());
                                }
                            }
                        }
                    }
                }

                if (isValid)
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
                // Generate salt and hash for the new password
                string salt = GenerateSalt();
                string hash = ComputeHash(request.NewPassword, salt);

                bool success = false;

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("sp_AtualizarSenha", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@Token", request.Token);
                        command.Parameters.AddWithValue("@SenhaSalt", salt);
                        command.Parameters.AddWithValue("@SenhaHash", hash);

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                success = Convert.ToBoolean(reader["Sucesso"]);
                            }
                        }
                    }
                }

                if (success)
                {
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
