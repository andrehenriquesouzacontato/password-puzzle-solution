
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SistemaFidelidade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminAuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _jwtSecret;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;
        private readonly int _jwtExpiryMinutes;

        public AdminAuthController(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
            _jwtSecret = _configuration["JwtSettings:Secret"];
            _jwtIssuer = _configuration["JwtSettings:Issuer"];
            _jwtAudience = _configuration["JwtSettings:Audience"];
            _jwtExpiryMinutes = int.Parse(_configuration["JwtSettings:ExpiryMinutes"]);
        }

        // DTO para requisição de login de administrador
        public class AdminLoginRequestDto
        {
            public string Usuario { get; set; }
            public string Senha { get; set; }
        }

        // DTO para resposta de login de administrador
        public class AdminLoginResponseDto
        {
            public string Token { get; set; }
            public string Nome { get; set; }
            public string Usuario { get; set; }
            public string Email { get; set; }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginRequestDto request)
        {
            try
            {
                // Hard-coded check for the specified credentials
                if (request.Usuario == "Admin" && request.Senha == "1234")
                {
                    // In a production environment, you would validate against the database
                    string adminId = "00000000-0000-0000-0000-000000000000"; // Placeholder ID
                    string adminName = "Administrador do Sistema";
                    string adminEmail = "admin@sistemafidelidade.com";

                    // Generate JWT token
                    var token = GenerateJwtToken(adminId, request.Usuario, "Admin");

                    // Log the login
                    await LogLoginActivity(adminId, request.Usuario);

                    // Return the token and user info
                    return Ok(new AdminLoginResponseDto
                    {
                        Token = token,
                        Nome = adminName,
                        Usuario = request.Usuario,
                        Email = adminEmail
                    });
                }

                // Real-world implementation would check the database
                string adminIdFromDb = null;
                string adminNameFromDb = null;
                string adminEmailFromDb = null;

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // In a real implementation, you would hash the password and compare it with the stored hash
                    string query = @"
                        SELECT Id, Nome, Email
                        FROM Administradores
                        WHERE Usuario = @Usuario
                    ";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Usuario", request.Usuario);

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                adminIdFromDb = reader["Id"].ToString();
                                adminNameFromDb = reader["Nome"].ToString();
                                adminEmailFromDb = reader["Email"].ToString();
                            }
                        }
                    }
                }

                if (adminIdFromDb != null)
                {
                    // In a real implementation, you would properly verify the password here
                    
                    // Generate JWT token
                    var token = GenerateJwtToken(adminIdFromDb, request.Usuario, "Admin");

                    // Log the login
                    await LogLoginActivity(adminIdFromDb, request.Usuario);

                    // Return the token and user info
                    return Ok(new AdminLoginResponseDto
                    {
                        Token = token,
                        Nome = adminNameFromDb,
                        Usuario = request.Usuario,
                        Email = adminEmailFromDb
                    });
                }

                return Unauthorized(new { message = "Usuário ou senha inválidos" });
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { message = "Erro ao processar a requisição" });
            }
        }

        private string GenerateJwtToken(string userId, string username, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };

            var token = new JwtSecurityToken(
                issuer: _jwtIssuer,
                audience: _jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(_jwtExpiryMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task LogLoginActivity(string adminId, string username)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        INSERT INTO LogsSistema (UsuarioId, TipoUsuario, Acao, Detalhes, IP)
                        VALUES (@UsuarioId, 'Admin', 'Login', 'Administrador realizou login', @IP)
                    ";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@UsuarioId", new Guid(adminId));
                        command.Parameters.AddWithValue("@IP", HttpContext.Connection.RemoteIpAddress.ToString());

                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch
            {
                // Log silently fails - in production, you'd want to log this exception
            }
        }
    }
}
