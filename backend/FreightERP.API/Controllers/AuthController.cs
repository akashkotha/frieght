using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreightERP.API.Data;
using FreightERP.API.DTOs;
using FreightERP.API.Services;

namespace FreightERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly FreightERPContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(FreightERPContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive);

        if (user == null)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        // For demo purposes, using simple password check
        // In production, use BCrypt or similar for password hashing
        if (request.Password != "Admin@123" && request.Password != "password")
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        var token = _tokenService.GenerateToken(user);

        return Ok(new LoginResponse
        {
            Token = token,
            User = new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            }
        });
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register([FromBody] RegisterRequest request)
    {
        // Check if username already exists
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest(new { message = "Username already exists" });
        }

        var user = new Models.User
        {
            Username = request.Username,
            PasswordHash = "TempHash", // In production, hash the password
            FullName = request.FullName,
            Email = request.Email,
            Role = request.Role ?? "Operations"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role
        });
    }
}

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Role { get; set; }
}
