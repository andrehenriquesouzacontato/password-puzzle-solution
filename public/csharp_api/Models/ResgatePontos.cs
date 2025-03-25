
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaFidelidade.API.Models
{
    public class ResgatePontos
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public Guid ClienteId { get; set; }
        
        [Required]
        public int PontosResgatados { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Descricao { get; set; } = null!;
        
        [Required]
        public DateTime Data { get; set; } = DateTime.Now;
        
        [ForeignKey("ClienteId")]
        public virtual Cliente Cliente { get; set; } = null!;
    }
}
