
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SistemaFidelidade.API.Data;
using SistemaFidelidade.API.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SistemaFidelidade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _jwtSecret;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;
        private readonly int _jwtExpiryMinutes;

        public AdminAuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                    var admin = await _context.Administradores
                        .FirstOrDefaultAsync(a => a.Usuario == "Admin");

                    if (admin == null)
                    {
                        // Use default admin if not found in database
                        admin = new Administrador
                        {
                            Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                            Nome = "Administrador do Sistema",
                            Usuario = "Admin",
                            Email = "admin@sistemafidelidade.com"
                        };
                    }

                    // Generate JWT token
                    var token = GenerateJwtToken(admin.Id.ToString(), request.Usuario, "Admin");

                    // Log the login
                    await LogLoginActivity(admin.Id, request.Usuario);

                    // Return the token and user info
                    return Ok(new AdminLoginResponseDto
                    {
                        Token = token,
                        Nome = admin.Nome,
                        Usuario = request.Usuario,
                        Email = admin.Email
                    });
                }

                // Real-world implementation using Entity Framework
                var adminFromDb = await _context.Administradores
                    .FirstOrDefaultAsync(a => a.Usuario == request.Usuario);

                if (adminFromDb != null)
                {
                    // In a real implementation, you would properly verify the password here
                    // using the stored hash and salt
                    
                    // Generate JWT token
                    var token = GenerateJwtToken(adminFromDb.Id.ToString(), request.Usuario, "Admin");

                    // Log the login
                    await LogLoginActivity(adminFromDb.Id, request.Usuario);

                    // Update last access
                    adminFromDb.UltimoAcesso = DateTime.Now;
                    await _context.SaveChangesAsync();

                    // Return the token and user info
                    return Ok(new AdminLoginResponseDto
                    {
                        Token = token,
                        Nome = adminFromDb.Nome,
                        Usuario = request.Usuario,
                        Email = adminFromDb.Email
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

        private async Task LogLoginActivity(Guid adminId, string username)
        {
            try
            {
                var logEntry = new LogSistema
                {
                    UsuarioId = adminId,
                    TipoUsuario = "Admin",
                    Acao = "Login",
                    Detalhes = "Administrador realizou login",
                    IP = HttpContext.Connection.RemoteIpAddress.ToString()
                };

                _context.LogsSistema.Add(logEntry);
                await _context.SaveChangesAsync();
            }
            catch
            {
                // Log silently fails - in production, you'd want to log this exception
            }
        }
    }
}
