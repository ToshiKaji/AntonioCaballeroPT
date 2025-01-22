using Backend_transacciones.DbContext;
using Backend_transacciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend_transacciones.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarjetasController : ControllerBase
    {

        private readonly TransaccionesContext _context;

        public TarjetasController(TransaccionesContext context)
        {
            _context = context;
        }
        // GET: api/<TarjetasController>
        [HttpGet]
        public async Task<IEnumerable<TarjetasModel>> ObtenerTodas()
        {
            return await _context.Tarjetas.ToListAsync();
        }

        // GET api/<TarjetasController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<TarjetasController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<TarjetasController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<TarjetasController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
