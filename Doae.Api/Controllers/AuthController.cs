
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Doae.Api.Data;
using Doae.Api.Dtos;
using Doae.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Doae.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher<Usuario> _passwordHasher;
    private readonly IConfiguration _configuration;

    public AuthController(
        AppDbContext context,
        IPasswordHasher<Usuario> passwordHasher,
        IConfiguration configuration)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    /// <summary>
    /// Realiza o login de um usuário.
    /// </summary>
    /// <remarks>
    /// Valida o e-mail e a senha e, se estiverem corretos,
    /// retorna um token JWT com validade de 2 horas.
    /// </remarks>
    /// <response code="200">Login realizado com sucesso.</response>
    /// <response code="400">Dados de login inválidos.</response>
    /// <response code="401">E-mail ou senha incorretos.</response>
    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(LoginRequestDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();

        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email);

        if (usuario is null ||
            string.IsNullOrEmpty(usuario.SenhaHash))
        {
            return Unauthorized(new
            {
                mensagem = "E-mail ou senha inválidos."
            });
        }

        var resultado = _passwordHasher.VerifyHashedPassword(
            usuario,
            usuario.SenhaHash,
            dto.Senha
        );

        if (resultado == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new
            {
                mensagem = "E-mail ou senha inválidos."
            });
        }

        // Recupera a chave JWT do User Secrets.
        var chave = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "Chave JWT não configurada."
            );

        // Configura a assinatura do token.
        var chaveSegura = new SymmetricSecurityKey(
            Convert.FromBase64String(chave)
        );

        var credenciais = new SigningCredentials(
            chaveSegura,
            SecurityAlgorithms.HmacSha256
        );

        // Define as informações de identidade do usuário.
        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                usuario.Id.ToString()
            ),
            new Claim(
                ClaimTypes.Name,
                usuario.Nome
            ),
            new Claim(
                JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString()
            )
        };

        // Define a validade de 2 horas.
        var expiracao = DateTime.UtcNow.AddHours(2);

        // Gera o token JWT.
        var token = new JwtSecurityToken(
            issuer: "Doae.Api",
            audience: "Doae.Web",
            claims: claims,
            expires: expiracao,
            signingCredentials: credenciais
        );

        return Ok(new
        {
            mensagem = "Login realizado com sucesso.",
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiraEm = expiracao,
            usuario = new
            {
                usuario.Id,
                usuario.Nome,
                usuario.Email,
                usuario.Cidade
            }
        });
    }

    /// <summary>
    /// Consulta o usuário autenticado.
    /// </summary>
    /// <remarks>
    /// Requer um token JWT válido no cabeçalho Authorization.
    /// Retorna o ID e o nome do usuário autenticado.
    /// </remarks>
    /// <response code="200">Usuário identificado com sucesso.</response>
    /// <response code="401">Token ausente, inválido ou expirado.</response>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Me()
    {
        var id = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        var nome = User.Identity?.Name;

        if (!int.TryParse(id, out var usuarioId))
            return Unauthorized();

        return Ok(new
        {
            id = usuarioId,
            nome = nome
        });
    }
}
