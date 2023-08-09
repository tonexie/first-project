using System.Threading.Tasks;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;


namespace src.Middleware
{
    // Authenticate http requests using firebase authentication tokens
    public class FirebaseAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public FirebaseAuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                context.Response.StatusCode = 401;
                return;
            }

            var token = authHeader.Replace("Bearer ", string.Empty);

            try
            {
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
                context.Items["User"] = decodedToken;
            }
            catch (FirebaseAuthException)
            {
                context.Response.StatusCode = 401;
                return;
            }

            await _next(context);
        }
    }
}
