
using Microsoft.AspNetCore.Mvc;

namespace SistemaFidelidade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "online", message = "API está funcionando corretamente." });
        }
    }
}
