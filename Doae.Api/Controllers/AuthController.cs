
using Doae.Api.Data;
using Doae.Api.Dtos;
using Doae.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

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


    [HttpPost("login")]
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

        
var chave = _configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "Chave JWT não configurada."
    );

// Prepara a assinatura do token.
var chaveSegura = new SymmetricSecurityKey(
    Convert.FromBase64String(chave)
);

var credenciais = new SigningCredentials(
    chaveSegura,
    SecurityAlgorithms.HmacSha256
);

// Identifica o usuário dentro do token.
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
    new Claim(ClaimTypes.Name, usuario.Nome),
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
};

// Define a validade do token.
var expiracao = DateTime.UtcNow.AddHours(2);

// Cria o JWT.
var token = new JwtSecurityToken(
    issuer: "Doae.Api",
    audience: "Doae.Web",
    claims: claims,
    expires: expiracao,
    signingCredentials: credenciais
);

// Devolve o token para o front-end.
return Ok(new
{
    mensagem = "Login realizado com sucesso.",
    token = new JwtSecurityTokenHandler().WriteToken(token),
    expiraEm = expiracao,
    usuario = new
    {
        usuario.Id,
        usuario.Nome
    }
});
    }

   
[Authorize]
[HttpGet("me")]
public IActionResult Me()
{
    var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
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

