using Doae.Api.Models;

namespace Doae.Api.Dtos;

public record ItemDto(
    int Id,
    string Titulo,
    string Descricao,
    string EstadoConservacao,
    string Cidade,
    StatusItem Status,
    DateTime CriadoEm,
    int UsuarioId,
    string UsuarioNome,
    int CategoriaId,
    string CategoriaNome);