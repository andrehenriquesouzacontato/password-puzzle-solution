
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaFidelidade.API.Models
{
    public class Compra
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public Guid ClienteId { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Valor { get; set; }
        
        [Required]
        public int Pontos { get; set; }
        
        [Required]
        public DateTime Data { get; set; } = DateTime.Now;
        
        [ForeignKey("ClienteId")]
        public virtual Cliente Cliente { get; set; } = null!;
    }
}
