
using System;
using System.ComponentModel.DataAnnotations;

namespace SistemaFidelidade.API.Models
{
    public class Administrador
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = null!;
        
        [Required]
        [StringLength(20)]
        public string Usuario { get; set; } = null!;
        
        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = null!;
        
        [StringLength(128)]
        public string? SenhaSalt { get; set; }
        
        [StringLength(128)]
        public string? SenhaHash { get; set; }
        
        [Required]
        public DateTime DataCadastro { get; set; } = DateTime.Now;
        
        [StringLength(128)]
        public string? TokenRecuperacao { get; set; }
        
        public DateTime? TokenExpiracao { get; set; }
        
        public DateTime? UltimoAcesso { get; set; }
    }
}
