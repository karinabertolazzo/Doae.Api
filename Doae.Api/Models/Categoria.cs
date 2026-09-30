namespace Doae.Api.Models;

public class Categoria
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;

    public List<Item> Itens { get; set; } = new();
}