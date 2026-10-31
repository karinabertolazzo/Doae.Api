using System.Linq.Expressions;
using Doae.Api.Data;
using Doae.Api.Dtos;
using Doae.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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


/// <summary>Consulta o contato da outra pessoa em uma solicitação aceita.</summary>
[Authorize]
[HttpGet("{id:int}/contatos")]
[ProducesResponseType(typeof(ContatoSolicitacaoDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status409Conflict)]
public async Task<ActionResult<ContatoSolicitacaoDto>> ConsultarContatos(int id)
{
    // Identifica o usuário pelo JWT.
    var idToken = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (!int.TryParse(idToken, out var usuarioLogadoId))
        return Unauthorized();

    // Busca a solicitação, o item e os dois usuários envolvidos.
    var solicitacao = await _context.Solicitacoes
        .AsNoTracking()
        .Include(s => s.Item)
            .ThenInclude(i => i!.Usuario)
        .Include(s => s.Solicitante)
        .FirstOrDefaultAsync(s => s.Id == id);

    if (solicitacao is null || solicitacao.Item is null)
        return NotFound();

    // Identifica se o usuário é o doador ou o solicitante.
    var ehDoador = solicitacao.Item.UsuarioId == usuarioLogadoId;
    var ehSolicitante = solicitacao.SolicitanteId == usuarioLogadoId;

    // Pessoas de fora não podem consultar os contatos.
    if (!ehDoador && !ehSolicitante)
        return Forbid();

    // Os contatos só ficam disponíveis após a aceitação.
    if (solicitacao.Status != StatusSolicitacao.Aceita)
    {
        return Conflict(new ProblemDetails
        {
            Status = StatusCodes.Status409Conflict,
            Title = "Contatos indisponíveis.",
            Detail = "A solicitação precisa estar aceita."
        });
    }

    // Cada participante recebe o contato da outra pessoa.
    var contato = ehDoador
        ? solicitacao.Solicitante
        : solicitacao.Item.Usuario;

    if (contato is null)
        return NotFound();

    var tipoContato = ehDoador ? "Solicitante" : "Doador";

    var resposta = new ContatoSolicitacaoDto(
        solicitacao.Id,
        solicitacao.Item.Id,
        solicitacao.Item.Titulo,
        tipoContato,
        contato.Nome,
        contato.Email,
        contato.Telefone,
        contato.Cidade
    );

    return Ok(resposta);
}

    
/// <summary>Cria uma solicitação para um item disponível.</summary>
[Authorize]
[HttpPost]
[ProducesResponseType(typeof(SolicitacaoDto), StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status409Conflict)]
public async Task<ActionResult<SolicitacaoDto>> Criar(
    SolicitacaoRequestDto dto)
{
    // Identifica o usuário autenticado pelo JWT.
    var idToken = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (!int.TryParse(idToken, out var usuarioLogadoId))
        return Unauthorized();

    // Impede criar solicitações em nome de outra pessoa.
    if (usuarioLogadoId != dto.SolicitanteId)
        return Forbid();

    var item = await _context.Itens.FindAsync(dto.ItemId);

    if (item is null)
        return DadosInvalidos("O item informado não existe.");

    var solicitante = await _context.Usuarios
        .FindAsync(usuarioLogadoId);

    if (solicitante is null)
        return DadosInvalidos("O usuário solicitante não existe.");

    if (item.UsuarioId == solicitante.Id)
        return DadosInvalidos(
            "O dono do item não pode solicitar o próprio item."
        );

    if (item.Status != StatusItem.Disponivel)
        return Conflito(
            "Não foi possível solicitar o item.",
            "O item não está mais disponível."
        );

    var jaSolicitou = await _context.Solicitacoes.AnyAsync(s =>
        s.ItemId == item.Id &&
        s.SolicitanteId == solicitante.Id &&
        s.Status == StatusSolicitacao.Pendente);

    if (jaSolicitou)
        return Conflito(
            "Solicitação duplicada.",
            "Você já possui uma solicitação pendente para este item."
        );

    var solicitacao = new Solicitacao
    {
        Mensagem = dto.Mensagem?.Trim(),
        Item = item,
        Solicitante = solicitante
    };

    _context.Solicitacoes.Add(solicitacao);

    await _context.SaveChangesAsync();

    return CreatedAtAction(
        nameof(BuscarPorId),
        new { id = solicitacao.Id },
        ParaDto(solicitacao)
    );
}


    
/// <summary>Permite ao dono do item aceitar uma solicitação pendente.</summary>
[Authorize]
[HttpPatch("{id:int}/aceitar")]
[ProducesResponseType(typeof(SolicitacaoDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status409Conflict)]
public async Task<ActionResult<SolicitacaoDto>> Aceitar(int id)
{
    // Identifica o usuário autenticado pelo JWT.
    var idToken = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (!int.TryParse(idToken, out var usuarioLogadoId))
        return Unauthorized();

    var solicitacao = await BuscarComRelacionamentos(id);

    if (solicitacao is null)
        return NotFound();

    // Somente o dono do item pode aceitar a solicitação.
    if (solicitacao.Item!.UsuarioId != usuarioLogadoId)
        return Forbid();

    if (solicitacao.Status != StatusSolicitacao.Pendente)
        return Conflito(
            "Não foi possível aceitar a solicitação.",
            "Apenas solicitações pendentes podem ser aceitas."
        );

   
if (solicitacao.Item.Status != StatusItem.Disponivel)
    return Conflito(
        "Não foi possível aceitar a solicitação.",
        "O item não está mais disponível."
    );


    solicitacao.Status = StatusSolicitacao.Aceita;
    solicitacao.Item.Status = StatusItem.Reservado;

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


/// <summary>Confirma a entrega de um item reservado e conclui a doação.</summary>
[Authorize]
[HttpPatch("{id:int}/concluir")]
[ProducesResponseType(typeof(SolicitacaoDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status409Conflict)]
public async Task<ActionResult<SolicitacaoDto>> Concluir(int id)
{
    var idToken = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (!int.TryParse(idToken, out var usuarioLogadoId))
        return Unauthorized();

    var solicitacao = await BuscarComRelacionamentos(id);

    if (solicitacao is null)
        return NotFound();

    // Somente o dono do item pode confirmar a entrega.
    if (solicitacao.Item!.UsuarioId != usuarioLogadoId)
        return Forbid();

    // A entrega só pode ser concluída após a aceitação.
    if (solicitacao.Status != StatusSolicitacao.Aceita ||
        solicitacao.Item.Status != StatusItem.Reservado)
    {
        return Conflito(
            "Não foi possível concluir a doação.",
            "A solicitação deve estar aceita e o item reservado."
        );
    }

    // Finaliza a solicitação e o item.
    solicitacao.Status = StatusSolicitacao.Concluida;
    solicitacao.Item.Status = StatusItem.Doado;

    await _context.SaveChangesAsync();

    return Ok(ParaDto(solicitacao));
}


    
/// <summary>Permite ao dono do item recusar uma solicitação pendente.</summary>
[Authorize]
[HttpPatch("{id:int}/recusar")]
[ProducesResponseType(typeof(SolicitacaoDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status409Conflict)]
public Task<ActionResult<SolicitacaoDto>> Recusar(int id) =>
    EncerrarPendente(id, StatusSolicitacao.Recusada, "recusadas");

/// <summary>Permite ao solicitante cancelar seu pedido pendente.</summary>
[Authorize]
[HttpPatch("{id:int}/cancelar")]
[ProducesResponseType(typeof(SolicitacaoDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status409Conflict)]
public Task<ActionResult<SolicitacaoDto>> Cancelar(int id) =>
    EncerrarPendente(id, StatusSolicitacao.Cancelada, "canceladas");
    
private async Task<ActionResult<SolicitacaoDto>> EncerrarPendente(
    int id, StatusSolicitacao novoStatus, string acaoNoPlural)
{
    var idToken = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (!int.TryParse(idToken, out var usuarioLogadoId))
        return Unauthorized();

    var solicitacao = await BuscarComRelacionamentos(id);

    if (solicitacao is null)
        return NotFound();

    // Verifica quem tem permissão para realizar a operação.
    var autorizado = novoStatus switch
    {
        StatusSolicitacao.Recusada =>
            solicitacao.Item!.UsuarioId == usuarioLogadoId,

        StatusSolicitacao.Cancelada =>
            solicitacao.SolicitanteId == usuarioLogadoId,

        _ => false
    };

    if (!autorizado)
        return Forbid();

    if (solicitacao.Status != StatusSolicitacao.Pendente)
        return Conflito(
            "Não foi possível alterar a solicitação.",
            $"Apenas solicitações pendentes podem ser {acaoNoPlural}."
        );

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