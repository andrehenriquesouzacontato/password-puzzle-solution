
using System;
using System.ComponentModel.DataAnnotations;

namespace SistemaFidelidade.API.Models
{
    public class LogSistema
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid? UsuarioId { get; set; }
        
        [Required]
        [StringLength(20)]
        public string TipoUsuario { get; set; } = null!;
        
        [Required]
        [StringLength(255)]
        public string Acao { get; set; } = null!;
        
        public string? Detalhes { get; set; }
        
        [Required]
        public DateTime Timestamp { get; set; } = DateTime.Now;
        
        [StringLength(50)]
        public string? IP { get; set; }
    }
}
