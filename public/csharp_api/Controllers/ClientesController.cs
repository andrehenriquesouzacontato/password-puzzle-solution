
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaFidelidade.API.Data;
using SistemaFidelidade.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SistemaFidelidade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ClientesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // DTOs
        public class ClienteDto
        {
            public Guid Id { get; set; }
            public string Nome { get; set; }
            public string CPF { get; set; }
            public string Email { get; set; }
            public string Telefone { get; set; }
            public int Pontos { get; set; }
            public DateTime DataCadastro { get; set; }
            public DateTime? UltimoAcesso { get; set; }
        }

        public class ClienteCreateDto
        {
            public string Nome { get; set; }
            public string CPF { get; set; }
            public string Email { get; set; }
            public string Telefone { get; set; }
            public string Senha { get; set; }
        }

        public class ClienteUpdateDto
        {
            public string Nome { get; set; }
            public string Email { get; set; }
            public string Telefone { get; set; }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteDto>>> GetClientes()
        {
            var clientes = await _context.Clientes
                .Select(c => new ClienteDto
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    CPF = c.CPF,
                    Email = c.Email,
                    Telefone = c.Telefone,
                    Pontos = c.Pontos,
                    DataCadastro = c.DataCadastro,
                    UltimoAcesso = c.UltimoAcesso
                })
                .OrderBy(c => c.Nome)
                .ToListAsync();

            return Ok(clientes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteDto>> GetCliente(Guid id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return new ClienteDto
            {
                Id = cliente.Id,
                Nome = cliente.Nome,
                CPF = cliente.CPF,
                Email = cliente.Email,
                Telefone = cliente.Telefone,
                Pontos = cliente.Pontos,
                DataCadastro = cliente.DataCadastro,
                UltimoAcesso = cliente.UltimoAcesso
            };
        }

        [HttpPost]
        public async Task<ActionResult<ClienteDto>> CreateCliente(ClienteCreateDto createDto)
        {
            // Verificar se CPF já existe
            if (await _context.Clientes.AnyAsync(c => c.CPF == createDto.CPF))
            {
                return BadRequest(new { message = "CPF já cadastrado" });
            }

            // Verificar se email já existe (se fornecido)
            if (!string.IsNullOrEmpty(createDto.Email) && await _context.Clientes.AnyAsync(c => c.Email == createDto.Email))
            {
                return BadRequest(new { message = "Email já cadastrado" });
            }

            // Gerar salt e hash para a senha
            string salt = GenerateSalt();
            string hash = ComputeHash(createDto.Senha, salt);

            var cliente = new Cliente
            {
                Nome = createDto.Nome,
                CPF = createDto.CPF,
                Email = createDto.Email,
                Telefone = createDto.Telefone,
                SenhaSalt = salt,
                SenhaHash = hash,
                DataCadastro = DateTime.Now
            };

            _context.Clientes.Add(cliente);
            
            // Registrar o log
            _context.LogsSistema.Add(new LogSistema
            {
                UsuarioId = null, // Poderia ser o ID do admin logado
                TipoUsuario = "Admin",
                Acao = "Cadastro de Cliente",
                Detalhes = $"Cliente {cliente.Nome} (CPF: {cliente.CPF}) cadastrado",
                IP = HttpContext.Connection.RemoteIpAddress?.ToString()
            });
            
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, new ClienteDto
            {
                Id = cliente.Id,
                Nome = cliente.Nome,
                CPF = cliente.CPF,
                Email = cliente.Email,
                Telefone = cliente.Telefone,
                Pontos = cliente.Pontos,
                DataCadastro = cliente.DataCadastro,
                UltimoAcesso = cliente.UltimoAcesso
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCliente(Guid id, ClienteUpdateDto updateDto)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            // Verificar se email já existe (se estiver sendo alterado)
            if (!string.IsNullOrEmpty(updateDto.Email) && 
                updateDto.Email != cliente.Email && 
                await _context.Clientes.AnyAsync(c => c.Email == updateDto.Email))
            {
                return BadRequest(new { message = "Email já cadastrado para outro cliente" });
            }

            cliente.Nome = updateDto.Nome;
            cliente.Email = updateDto.Email;
            cliente.Telefone = updateDto.Telefone;

            // Registrar o log
            _context.LogsSistema.Add(new LogSistema
            {
                UsuarioId = null, // Poderia ser o ID do admin logado
                TipoUsuario = "Admin",
                Acao = "Atualização de Cliente",
                Detalhes = $"Cliente {cliente.Nome} (CPF: {cliente.CPF}) atualizado",
                IP = HttpContext.Connection.RemoteIpAddress?.ToString()
            });

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(Guid id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(cliente);
            
            // Registrar o log
            _context.LogsSistema.Add(new LogSistema
            {
                UsuarioId = null, // Poderia ser o ID do admin logado
                TipoUsuario = "Admin",
                Acao = "Exclusão de Cliente",
                Detalhes = $"Cliente {cliente.Nome} (CPF: {cliente.CPF}) excluído",
                IP = HttpContext.Connection.RemoteIpAddress?.ToString()
            });
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Helper methods
        private string GenerateSalt()
        {
            byte[] saltBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }

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
