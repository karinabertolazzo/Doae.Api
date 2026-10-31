
using System.ComponentModel.DataAnnotations;

namespace Doae.Api.Dtos;

public class UsuarioCadastroRequestDto : UsuarioRequestDto
{
    [Required(ErrorMessage = "A senha é obrigatória.")]
    [StringLength(128, MinimumLength = 8,
        ErrorMessage = "A senha deve ter entre 8 e 128 caracteres.")]
    public string Senha { get; set; } = string.Empty;
}
