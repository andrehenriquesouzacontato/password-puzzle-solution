
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaFidelidade.API.Models
{
    public class Cliente
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = null!;
        
        [Required]
        [StringLength(14)]
        public string CPF { get; set; } = null!;
        
        [StringLength(100)]
        [EmailAddress]
        public string? Email { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Telefone { get; set; } = null!;
        
        [Required]
        public int Pontos { get; set; } = 0;
        
        [Required]
        public DateTime DataCadastro { get; set; } = DateTime.Now;
        
        [StringLength(128)]
        public string? SenhaSalt { get; set; }
        
        [StringLength(128)]
        public string? SenhaHash { get; set; }
        
        [StringLength(128)]
        public string? TokenRecuperacao { get; set; }
        
        public DateTime? TokenExpiracao { get; set; }
        
        public DateTime? UltimoAcesso { get; set; }

        // Navegação
        public virtual ICollection<Compra> Compras { get; set; } = new List<Compra>();
        public virtual ICollection<ResgatePontos> ResgatesPontos { get; set; } = new List<ResgatePontos>();
    }
}
