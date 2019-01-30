using System.Security.Claims;

namespace OeboWebApp
{
    public static class UserExtensions
    {
        public static string GetId(this ClaimsPrincipal user) => user.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
