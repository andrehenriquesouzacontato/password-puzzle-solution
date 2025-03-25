
using Microsoft.EntityFrameworkCore;
using SistemaFidelidade.API.Models;

namespace SistemaFidelidade.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; } = null!;
        public DbSet<Administrador> Administradores { get; set; } = null!;
        public DbSet<Compra> Compras { get; set; } = null!;
        public DbSet<ResgatePontos> ResgatePontos { get; set; } = null!;
        public DbSet<LogSistema> LogsSistema { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações de índice
            modelBuilder.Entity<Cliente>()
                .HasIndex(c => c.CPF)
                .IsUnique();

            modelBuilder.Entity<Compra>()
                .HasIndex(c => c.ClienteId);

            modelBuilder.Entity<Compra>()
                .HasIndex(c => c.Data);

            modelBuilder.Entity<ResgatePontos>()
                .HasIndex(r => r.ClienteId);

            // Administrador padrão
            modelBuilder.Entity<Administrador>().HasData(
                new Administrador
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    Nome = "Administrador do Sistema",
                    Usuario = "Admin",
                    Email = "admin@sistemafidelidade.com",
                    SenhaSalt = "static-salt",
                    SenhaHash = "hashed-password-for-1234",
                    DataCadastro = DateTime.Now
                }
            );
        }
    }
}
