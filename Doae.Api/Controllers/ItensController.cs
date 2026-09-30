using System.Linq.Expressions;
using Doae.Api.Data;
using Doae.Api.Dtos;
using Doae.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Doae.Api.Controllers;

[ApiController]
[Route("api/itens")]
public class ItensController : ControllerBase
{
    private static readonly Expression<Func<Item, ItemDto>> Projecao = i => new ItemDto(
        i.Id,
        i.Titulo,
        i.Descricao,
        i.EstadoConservacao,
        i.Cidade,
        i.Status,
        i.CriadoEm,
        i.UsuarioId,
        i.Usuario!.Nome,
        i.CategoriaId,
        i.Categoria!.Nome);

    private static readonly Func<Item, ItemDto> ParaDto = Projecao.Compile();

    private readonly AppDbContext _context;

    public ItensController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Lista os itens, com filtros opcionais por categoria, cidade, status e texto.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ItemDto>>> Listar(
        [FromQuery] int? categoriaId,
        [FromQuery] string? cidade,
        [FromQuery] StatusItem? status,
        [FromQuery] string? busca)
    {
        var consulta = _context.Itens.AsNoTracking().AsQueryable();

        if (categoriaId.HasValue)
            consulta = consulta.Where(i => i.CategoriaId == categoriaId.Value);

        if (!string.IsNullOrWhiteSpace(cidade))
            consulta = consulta.Where(i => EF.Functions.Like(i.Cidade, cidade.Trim()));

        if (status.HasValue)
            consulta = consulta.Where(i => i.Status == status.Value);

        if (!string.IsNullOrWhiteSpace(busca))
        {
            var termo = $"%{busca.Trim()}%";
            consulta = consulta.Where(i =>
                EF.Functions.Like(i.Titulo, termo) ||
                EF.Functions.Like(i.Descricao, termo));
        }

        var itens = await consulta
            .OrderByDescending(i => i.CriadoEm)
            .Select(Projecao)
            .ToListAsync();

        return Ok(itens);
    }

    /// <summary>Busca um item pelo id.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ItemDto>> BuscarPorId(int id)
    {
        var item = await _context.Itens
            .AsNoTracking()
            .Where(i => i.Id == id)
            .Select(Projecao)
            .FirstOrDefaultAsync();

        if (item is null)
            return NotFound();

        return Ok(item);
    }

    /// <summary>Cadastra um item para doação. Todo item nasce como Disponivel.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ItemDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ItemDto>> Criar(ItemRequestDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuario is null)
            return ReferenciaInvalida("O usuário informado não existe.");

        var categoria = await _context.Categorias.FindAsync(dto.CategoriaId);
        if (categoria is null)
            return ReferenciaInvalida("A categoria informada não existe.");

        var item = new Item
        {
            Titulo = dto.Titulo.Trim(),
            Descricao = dto.Descricao.Trim(),
            EstadoConservacao = dto.EstadoConservacao.Trim(),
            Cidade = dto.Cidade.Trim(),
            Usuario = usuario,
            Categoria = categoria
        };

        _context.Itens.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(BuscarPorId), new { id = item.Id }, ParaDto(item));
    }

    /// <summary>Atualiza um item disponível. O doador não pode ser alterado.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ItemDto>> Atualizar(int id, ItemRequestDto dto)
    {
        var item = await _context.Itens
            .Include(i => i.Usuario)
            .Include(i => i.Categoria)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (item is null)
            return NotFound();

        if (item.Status == StatusItem.Doado)
            return Conflito("Não foi possível atualizar o item.", "Itens já doados não podem ser alterados.");

        var categoria = await _context.Categorias.FindAsync(dto.CategoriaId);
        if (categoria is null)
            return ReferenciaInvalida("A categoria informada não existe.");

        item.Titulo = dto.Titulo.Trim();
        item.Descricao = dto.Descricao.Trim();
        item.EstadoConservacao = dto.EstadoConservacao.Trim();
        item.Cidade = dto.Cidade.Trim();
        item.Categoria = categoria;

        await _context.SaveChangesAsync();

        return Ok(ParaDto(item));
    }

    /// <summary>Remove um item que não possui solicitações.</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Remover(int id)
    {
        var item = await _context.Itens.FindAsync(id);

        if (item is null)
            return NotFound();

        if (await _context.Solicitacoes.AnyAsync(s => s.ItemId == id))
            return Conflito("Não foi possível remover o item.", "O item possui solicitações vinculadas.");

        _context.Itens.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private BadRequestObjectResult ReferenciaInvalida(string detalhe) =>
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