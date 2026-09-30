using Doae.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Doae.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Item> Itens => Set<Item>();
    public DbSet<Solicitacao> Solicitacoes => Set<Solicitacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Item>()
            .Property(i => i.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Solicitacao>()
            .Property(s => s.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Item>()
            .HasOne(i => i.Usuario)
            .WithMany(u => u.Itens)
            .HasForeignKey(i => i.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Solicitacao>()
            .HasOne(s => s.Solicitante)
            .WithMany(u => u.Solicitacoes)
            .HasForeignKey(s => s.SolicitanteId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Categoria>().HasData(
            new Categoria { Id = 1, Nome = "Móveis" },
            new Categoria { Id = 2, Nome = "Roupas" },
            new Categoria { Id = 3, Nome = "Livros" },
            new Categoria { Id = 4, Nome = "Eletrodomésticos" },
            new Categoria { Id = 5, Nome = "Outros" }
        );
    }
}