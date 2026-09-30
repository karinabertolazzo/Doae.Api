using System.Linq.Expressions;
using Doae.Api.Data;
using Doae.Api.Dtos;
using Doae.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Doae.Api.Controllers;

[ApiController]
[Route("api/solicitacoes")]
public class SolicitacoesController : ControllerBase
{
    private static readonly Expression<Func<Solicitacao, SolicitacaoDto>> Projecao = s => new SolicitacaoDto(
        s.Id,
        s.Mensagem,
        s.Status,
        s.CriadoEm,
        s.ItemId,
        s.Item!.Titulo,
        s.SolicitanteId,
        s.Solicitante!.Nome);

    private static readonly Func<Solicitacao, SolicitacaoDto> ParaDto = Projecao.Compile();

    private readonly AppDbContext _context;

    public SolicitacoesController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Lista as solicitações, com filtros opcionais por item, solicitante e status.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SolicitacaoDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<SolicitacaoDto>>> Listar(
        [FromQuery] int? itemId,
        [FromQuery] int? solicitanteId,
        [FromQuery] StatusSolicitacao? status)
    {
        var consulta = _context.Solicitacoes.AsNoTracking().AsQueryable();

        if (itemId.HasValue)
            consulta = consulta.Where(s => s.ItemId == itemId.Value);

        if (solicitanteId.HasValue)
            consulta = consulta.Where(s => s.SolicitanteId == solicitanteId.Value);

        if (status.HasValue)
            consulta = consulta.Where(s => s.Status == status.Value);

        var solicitacoes = await consulta
            .OrderByDescending(s => s.CriadoEm)
            .Select(Projecao)
            .ToListAsync();

        return Ok(solicitacoes);
    }

    /// <summary>Busca uma solicitação pelo id.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(SolicitacaoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SolicitacaoDto>> BuscarPorId(int id)
    {
        var solicitacao = await _context.Solicitacoes
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(Projecao)
            .FirstOrDefaultAsync();

        if (solicitacao is null)
            return NotFound();

        return Ok(solicitacao);
    }

    /// <summary>Solicita um item disponível. Toda solicitação nasce como Pendente.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(SolicitacaoDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<SolicitacaoDto>> Criar(SolicitacaoRequestDto dto)
    {
        var item = await _context.Itens.FindAsync(dto.ItemId);
        if (item is null)
            return DadosInvalidos("O item informado não existe.");

        var solicitante = await _context.Usuarios.FindAsync(dto.SolicitanteId);
        if (solicitante is null)
            return DadosInvalidos("O usuário solicitante não existe.");

        if (item.UsuarioId == solicitante.Id)
            return DadosInvalidos("O dono do item não pode solicitar o próprio item.");

        if (item.Status != StatusItem.Disponivel)
            return Conflito("Não foi possível solicitar o item.", "O item não está mais disponível.");

        var jaSolicitou = await _context.Solicitacoes.AnyAsync(s =>
            s.ItemId == item.Id &&
            s.SolicitanteId == solicitante.Id &&
            s.Status == StatusSolicitacao.Pendente);

        if (jaSolicitou)
            return Conflito("Solicitação duplicada.", "Você já possui uma solicitação pendente para este item.");

        var solicitacao = new Solicitacao
        {
            Mensagem = dto.Mensagem?.Trim(),
            Item = item,
            Solicitante = solicitante
        };

        _context.Solicitacoes.Add(solicitacao);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(BuscarPorId), new { id = solicitacao.Id }, ParaDto(solicitacao));
    }

    /// <summary>Aceita a solicitação: o item vira Doado e as outras pendentes do item são recusadas.</summary>
    [HttpPatch("{id:int}/aceitar")]
    [ProducesResponseType(typeof(SolicitacaoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<SolicitacaoDto>> Aceitar(int id)
    {
        var solicitacao = await BuscarComRelacionamentos(id);
        if (solicitacao is null)
            return NotFound();

        if (solicitacao.Status != StatusSolicitacao.Pendente)
            return Conflito("Não foi possível aceitar a solicitação.", "Apenas solicitações pendentes podem ser aceitas.");

        if (solicitacao.Item!.Status != StatusItem.Disponivel)
            return Conflito("Não foi possível aceitar a solicitação.", "O item já foi doado.");

        solicitacao.Status = StatusSolicitacao.Aceita;
        solicitacao.Item.Status = StatusItem.Doado;

        var outrasPendentes = await _context.Solicitacoes
            .Where(s => s.ItemId == solicitacao.ItemId
                        && s.Id != solicitacao.Id
                        && s.Status == StatusSolicitacao.Pendente)
            .ToListAsync();

        foreach (var outra in outrasPendentes)
            outra.Status = StatusSolicitacao.Recusada;

        await _context.SaveChangesAsync();

        return Ok(ParaDto(solicitacao));
    }

    /// <summary>Recusa uma solicitação pendente.</summary>
    [HttpPatch("{id:int}/recusar")]
    [ProducesResponseType(typeof(SolicitacaoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public Task<ActionResult<SolicitacaoDto>> Recusar(int id) =>
        EncerrarPendente(id, StatusSolicitacao.Recusada, "recusadas");

    /// <summary>Cancela uma solicitação pendente.</summary>
    [HttpPatch("{id:int}/cancelar")]
    [ProducesResponseType(typeof(SolicitacaoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public Task<ActionResult<SolicitacaoDto>> Cancelar(int id) =>
        EncerrarPendente(id, StatusSolicitacao.Cancelada, "canceladas");

    private async Task<ActionResult<SolicitacaoDto>> EncerrarPendente(
        int id, StatusSolicitacao novoStatus, string acaoNoPlural)
    {
        var solicitacao = await BuscarComRelacionamentos(id);
        if (solicitacao is null)
            return NotFound();

        if (solicitacao.Status != StatusSolicitacao.Pendente)
            return Conflito("Não foi possível alterar a solicitação.", $"Apenas solicitações pendentes podem ser {acaoNoPlural}.");

        solicitacao.Status = novoStatus;
        await _context.SaveChangesAsync();

        return Ok(ParaDto(solicitacao));
    }

    private Task<Solicitacao?> BuscarComRelacionamentos(int id) =>
        _context.Solicitacoes
            .Include(s => s.Item)
            .Include(s => s.Solicitante)
            .FirstOrDefaultAsync(s => s.Id == id);

    private BadRequestObjectResult DadosInvalidos(string detalhe) =>
        BadRequest(new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Dados inválidos.",
            Detail = detalhe
        });

    private ConflictObjectResult Conflito(string titulo, string detalhe) =>
        Conflict(new ProblemDetails
        {
            Status = StatusCodes.Status409Conflict,
            Title = titulo,
            Detail = detalhe
        });
}