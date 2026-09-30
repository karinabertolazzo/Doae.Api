namespace Doae.Api.Dtos;

public record UsuarioDto(
    int Id,
    string Nome,
    string Email,
    string? Telefone,
    string Cidade,
    DateTime CriadoEm);