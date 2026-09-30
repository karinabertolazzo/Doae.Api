using System.ComponentModel.DataAnnotations;

namespace Doae.Api.Dtos;

public class SolicitacaoRequestDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Informe o id do item.")]
    public int ItemId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Informe o id do usuário solicitante.")]
    public int SolicitanteId { get; set; }

    [StringLength(300, ErrorMessage = "A mensagem deve ter no máximo 300 caracteres.")]
    public string? Mensagem { get; set; }
}