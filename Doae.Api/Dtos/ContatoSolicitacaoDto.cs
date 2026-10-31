
namespace Doae.Api.Dtos;

public record ContatoSolicitacaoDto(
    int SolicitacaoId,
    int ItemId,
    string ItemTitulo,
    string TipoContato,
    string Nome,
    string Email,
    string? Telefone,
    string Cidade
);
