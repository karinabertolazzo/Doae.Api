namespace Doae.Api.Models;

public enum StatusSolicitacao
{
    Pendente,
    Aceita,
    Recusada,
    Cancelada
}

public class Solicitacao
{
    public int Id { get; set; }
    public string? Mensagem { get; set; }
    public StatusSolicitacao Status { get; set; } = StatusSolicitacao.Pendente;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public int ItemId { get; set; }
    public Item? Item { get; set; }

    public int SolicitanteId { get; set; }
    public Usuario? Solicitante { get; set; }
}