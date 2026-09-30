namespace Doae.Api.Models;

public enum StatusItem
{
    Disponivel,
    Doado
}

public class Item
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string EstadoConservacao { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public StatusItem Status { get; set; } = StatusItem.Disponivel;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    public int CategoriaId { get; set; }
    public Categoria? Categoria { get; set; }

    public List<Solicitacao> Solicitacoes { get; set; } = new();
}