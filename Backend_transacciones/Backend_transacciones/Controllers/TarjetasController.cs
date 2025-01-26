using Backend_transacciones.DbContext;
using Backend_transacciones.Modelos;
using Backend_transacciones.Modelos.DTOs;
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

        // "EstadoDeCuenta/{id de la tarjeta}"
        [HttpGet("EstadoDeCuenta/{id}")]
        
        public async Task<ActionResult<EstadoDeCuentaDTO>> ObtenerEstadoDeCuenta(string id)
        {
            var hoy = DateTime.Now;
            

            decimal totalCargos = await _context.Transacciones.Where(trs => trs.TarjetaID.ToString() == id && trs.Tipo == "C" && trs.Fecha.Month == hoy.Month).Select(trs => trs.Monto).SumAsync();

            decimal cargosMesAnterior = await _context.Transacciones.Where(trs => trs.TarjetaID.ToString() == id && trs.Tipo == "C" && trs.Fecha.Month == hoy.AddMonths(-1).Month).Select(trs => trs.Monto).SumAsync();


            var transacciones = await _context.Tarjetas.Where(tarjeta => tarjeta.TarjetaID.ToString() == id).Include(tarjeta => tarjeta.TransaccionesDeTarjeta).Select(tarjeta => new EstadoDeCuentaDTO
            {
                ID = tarjeta.TarjetaID,
                Titular = $"{tarjeta.NombresTitular} {tarjeta.ApellidosTitular}",
                Numero = tarjeta.Numero,
                Limite = tarjeta.Limite,
                SaldoActual = totalCargos,
                SaldoMesAnterior = cargosMesAnterior,
                InteresB = totalCargos * tarjeta.PIC,
                CuotaMinima = totalCargos * tarjeta.PCSM,
                Disponible = tarjeta.Limite - totalCargos,
                MontoTotalIntereses = totalCargos + (totalCargos * tarjeta.PIC),
                Cargos = tarjeta.TransaccionesDeTarjeta.Where(trs => trs.Tipo == "C").Select( trs => new TransaccionesDTO {
                    Monto = trs.Monto,
                    ID = trs.TransaccionID,
                    Fecha = trs.Fecha.ToString("dd/MM/yyyy"),
                    Descripcion = trs.Descripcion
                    
                }).ToList()

               

            }).FirstOrDefaultAsync();

            if(transacciones == null)
            {
                return BadRequest("Tarjeta no existente.");
            }

            return transacciones;
        }


        [HttpGet("Transacciones/{id}")]
        public async Task<ActionResult<EstadoDeCuentaDTO>> TransaccionesDetarjeta(string id)
        {
            var hoy = DateTime.Now;
            var transacciones = await _context.Tarjetas.Where(tarjeta => tarjeta.TarjetaID.ToString() == id).Include(transac => transac.TransaccionesDeTarjeta).Select(tarjeta => new EstadoDeCuentaDTO
            {
                Numero = tarjeta.Numero,
                Titular = $"{tarjeta.NombresTitular} {tarjeta.ApellidosTitular}",
                Cargos = tarjeta.TransaccionesDeTarjeta.Where(transac => transac.Fecha.Month == hoy.Month).Select(transac => new TransaccionesDTO
                {
                    ID = transac.TransaccionID,
                    Descripcion = transac.Descripcion,
                    Fecha = transac.Fecha.ToString("dd/MM/yy"),
                    Tipo = transac.Tipo,
                    Monto = transac.Monto
                }).ToList()

            }).FirstOrDefaultAsync();

            if (transacciones == null)
            {
                return BadRequest("Tarjeta no existente.");
            }
            return transacciones;
        
        }


        }
}
