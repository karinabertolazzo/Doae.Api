using Doae.Api.Models;

namespace Doae.Api.Dtos;

public record SolicitacaoDto(
    int Id,
    string? Mensagem,
    StatusSolicitacao Status,
    DateTime CriadoEm,
    int ItemId,
    string ItemTitulo,
    int SolicitanteId,
    string SolicitanteNome);