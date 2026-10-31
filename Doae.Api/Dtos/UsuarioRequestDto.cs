
using System.ComponentModel.DataAnnotations;

namespace Doae.Api.Dtos;

public class UsuarioRequestDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(100, MinimumLength = 2,
        ErrorMessage = "O nome deve ter entre 2 e 100 caracteres.")]
    [RegularExpression(
        @"^(?=.*\p{L})[\p{L}\p{M}\s'’.-]+$",
        ErrorMessage = "O nome deve conter letras e não pode conter números."
    )]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "Informe um e-mail válido.")]
    [StringLength(150,
        ErrorMessage = "O e-mail deve ter no máximo 150 caracteres.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "O telefone é obrigatório.")]
    [StringLength(20,
        ErrorMessage = "O telefone deve ter no máximo 20 caracteres.")]
    [RegularExpression(
        @"^(?:\([1-9][0-9]\)|[1-9][0-9])[\s.-]?(?:9[0-9]{4}|[2-9][0-9]{3})[\s.-]?[0-9]{4}$",
        ErrorMessage = "Informe um telefone válido com DDD."
    )]
    public string Telefone { get; set; } = string.Empty;

    [Required(ErrorMessage = "A cidade é obrigatória.")]
    [StringLength(100, MinimumLength = 2,
        ErrorMessage = "A cidade deve ter entre 2 e 100 caracteres.")]
    [RegularExpression(
        @"^(?=.*\p{L})[\p{L}\p{M}0-9\s'’.-]+$",
        ErrorMessage = "Informe um nome de cidade válido."
    )]
    public string Cidade { get; set; } = string.Empty;
}
