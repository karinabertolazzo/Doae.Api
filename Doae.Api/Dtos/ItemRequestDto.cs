using System.ComponentModel.DataAnnotations;

namespace Doae.Api.Dtos;

public class ItemRequestDto
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "O título deve ter entre 3 e 100 caracteres.")]
    public string Titulo { get; set; } = string.Empty;

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [StringLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Required(ErrorMessage = "O estado de conservação é obrigatório.")]
    [StringLength(50, ErrorMessage = "O estado de conservação deve ter no máximo 50 caracteres.")]
    public string EstadoConservacao { get; set; } = string.Empty;

    [Required(ErrorMessage = "A cidade é obrigatória.")]
    [StringLength(100, ErrorMessage = "A cidade deve ter no máximo 100 caracteres.")]
    public string Cidade { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Informe o id do usuário doador.")]
    public int UsuarioId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Informe o id da categoria.")]
    public int CategoriaId { get; set; }
}