using Doae.Api.Data;
using Doae.Api.Dtos;
using Doae.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Doae.Api.Controllers;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsuariosController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Lista todos os usuários.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<UsuarioDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<UsuarioDto>>> Listar()
    {
        var usuarios = await _context.Usuarios
            .AsNoTracking()
            .OrderBy(u => u.Nome)
            .Select(u => new UsuarioDto(u.Id, u.Nome, u.Email, u.Telefone, u.Cidade, u.CriadoEm))
            .ToListAsync();

        return Ok(usuarios);
    }

    /// <summary>Busca um usuário pelo id.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UsuarioDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UsuarioDto>> BuscarPorId(int id)
    {
        var usuario = await _context.Usuarios
            .AsNoTracking()
            .Where(u => u.Id == id)
            .Select(u => new UsuarioDto(u.Id, u.Nome, u.Email, u.Telefone, u.Cidade, u.CriadoEm))
            .FirstOrDefaultAsync();

        if (usuario is null)
            return NotFound();

        return Ok(usuario);
    }

    /// <summary>Cadastra um novo usuário.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(UsuarioDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<UsuarioDto>> Criar(UsuarioRequestDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();

        if (await _context.Usuarios.AnyAsync(u => u.Email == email))
            return EmailJaCadastrado();

        var usuario = new Usuario
        {
            Nome = dto.Nome.Trim(),
            Email = email,
            Telefone = dto.Telefone?.Trim(),
            Cidade = dto.Cidade.Trim()
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(BuscarPorId), new { id = usuario.Id }, ParaDto(usuario));
    }

    /// <summary>Atualiza os dados de um usuário.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(UsuarioDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<UsuarioDto>> Atualizar(int id, UsuarioRequestDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(id);

        if (usuario is null)
            return NotFound();

        var email = dto.Email.Trim().ToLowerInvariant();

        if (await _context.Usuarios.AnyAsync(u => u.Email == email && u.Id != id))
            return EmailJaCadastrado();

        usuario.Nome = dto.Nome.Trim();
        usuario.Email = email;
        usuario.Telefone = dto.Telefone?.Trim();
        usuario.Cidade = dto.Cidade.Trim();

        await _context.SaveChangesAsync();

        return Ok(ParaDto(usuario));
    }

    /// <summary>Remove um usuário que não possui itens nem solicitações.</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Remover(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);

        if (usuario is null)
            return NotFound();

        var possuiVinculos =
            await _context.Itens.AnyAsync(i => i.UsuarioId == id) ||
            await _context.Solicitacoes.AnyAsync(s => s.SolicitanteId == id);

        if (possuiVinculos)
        {
            return Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Não foi possível remover o usuário.",
                Detail = "O usuário possui itens ou solicitações vinculados."
            });
        }

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static UsuarioDto ParaDto(Usuario u) =>
        new(u.Id, u.Nome, u.Email, u.Telefone, u.Cidade, u.CriadoEm);

    private ConflictObjectResult EmailJaCadastrado() =>
        Conflict(new ProblemDetails
        {
            Status = StatusCodes.Status409Conflict,
            Title = "E-mail já cadastrado.",
            Detail = "Já existe um usuário com este e-mail."
        });
}