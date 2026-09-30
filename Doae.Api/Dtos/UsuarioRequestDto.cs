using System.ComponentModel.DataAnnotations;

namespace Doae.Api.Dtos;

public class UsuarioRequestDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 100 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "O e-mail informado não é válido.")]
    [StringLength(150, ErrorMessage = "O e-mail deve ter no máximo 150 caracteres.")]
    public string Email { get; set; } = string.Empty;

    [StringLength(20, ErrorMessage = "O telefone deve ter no máximo 20 caracteres.")]
    public string? Telefone { get; set; }

    [Required(ErrorMessage = "A cidade é obrigatória.")]
    [StringLength(100, ErrorMessage = "A cidade deve ter no máximo 100 caracteres.")]
    public string Cidade { get; set; } = string.Empty;
}