using Backend_transacciones.DbContext;
using Backend_transacciones.Modelos;
using Backend_transacciones.Modelos.DTOs;
using Backend_transacciones.Modelos.ValidacionesPersonalizadas;
using ClosedXML.Excel;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend_transacciones.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransaccionesController : ControllerBase
    {
        readonly private TransaccionesContext _context;

        

        public TransaccionesController(TransaccionesContext context)
        {
            _context = context;
        }



        // POST api/<TransaccionesController>
        [HttpPost("Cargo")]
        public async Task<IActionResult> CrearCargo([FromBody] NuevaTransaccionDTO transaccion)
        {
            var hoy = DateTime.Now;

            var validador = new TransaccionValidator();

            var resultado = await validador.ValidateAsync(transaccion);

            if (resultado.IsValid)
            {
                var limite = await _context.Tarjetas.Where(trj => trj.TarjetaID == transaccion.Tarjeta).Select(trj => trj.Limite).FirstOrDefaultAsync();
                var cargosDelMes = await _context.Transacciones.Where(trs => trs.TarjetaID == transaccion.Tarjeta && trs.Tipo == "C" && trs.Fecha.Month == hoy.Month).Select(trs => trs.Monto).SumAsync();

                if ((cargosDelMes + transaccion.Monto) <= limite)
                {

                    await _context.IngresarTransaccion(transaccion.Tipo, transaccion.Tarjeta, transaccion.Monto, transaccion.Descripcion, transaccion.Fecha);

                    return Ok("Cargo realizado con exito");
                }
                else
                {
                   
                    return BadRequest(new
                    {   TipoError = "logico",
                        Errors = new
                        {
                            campo = "Monto",
                            msg = "El monto supera el limite mensual de la tarjeta."
                        },
                        Message = "Validaciones fallidas."
                    });
                }
            }
            //catcheo y ordenamiento de los errores de validacion
            var listaDeErrores = resultado.Errors.Select(e => new
            {
                campo = e.PropertyName,
                msg = e.ErrorMessage
            }).ToList();

            return BadRequest(new
            {
               TipoError = "validacion",
                Errors = listaDeErrores,
               Message = "Validaciones fallidas."
            });
        }

        [HttpPost("Pago")]
        public async Task<IActionResult> CrearAbono([FromBody] NuevaTransaccionDTO transaccion)
        {
            //Si hubiese habido mas informacion de como funcionan los pasgos se pudiese haber hecho validaciones mas profundas como que los pagos
            //tenagan un monto minimo basado en la cuota minima que se calcula en la vista de estado de cuenta 
            var validador = new TransaccionValidator();

            var resultado = await validador.ValidateAsync(transaccion);

            if (resultado.IsValid)
            {
                
                    await _context.IngresarTransaccion(transaccion.Tipo, transaccion.Tarjeta, transaccion.Monto, "", transaccion.Fecha);

                    return Ok("Pago realizado con exito");
             
            }
            //catcheo y ordenamiento de los errores de validacion
            var listaDeErrores = resultado.Errors.Select(e => new
            {
                campo = e.PropertyName,
                msg = e.ErrorMessage
            }).ToList();

            return BadRequest(new
            {
                TipoError = "validacion",
                Errors = listaDeErrores,
                Message = "Validaciones fallidas."
            });
            
        }

        [HttpGet("ExportarTransacciones/{id}")]
        public async Task<IActionResult> ExportarCompras (string id)
        {
            var hoy = DateTime.Now;
            var comprasDeTarjeta = await _context.Tarjetas.Where(trj => trj.TarjetaID.ToString() == id ).Include(trj => trj.TransaccionesDeTarjeta).Select(trj => new
            {
                tarjeta = trj.Numero,
                titular = $"{trj.NombresTitular} {trj.NombresTitular}",
                compras = trj.TransaccionesDeTarjeta.Where(trs => trs.Tipo == "C" && trs.Fecha.Month == hoy.Month).Select(trs => new
                {
                    fecha = trs.Fecha.ToShortDateString(),
                    desc = trs.Descripcion,
                    monto = trs.Monto
                }).ToList()
                
            }).FirstOrDefaultAsync();

            if (comprasDeTarjeta == null)
            {
                return BadRequest("Tarjeta invalida.");
            }
            //creadno excel
            using (var libro = new XLWorkbook())
            {
                var pag = libro.Worksheets.Add("Compras");
                pag.Cell(1, 1).Value = $"Ttular: {comprasDeTarjeta.titular }";
                pag.Cell(2, 1).Value = $"Tarjeta: {comprasDeTarjeta.tarjeta}";
                pag.Cell(3, 1).Value = "Fecha";
                pag.Cell(3, 2).Value = "Descripcion";
                pag.Cell(3, 3).Value = "Monto";

                int fila = 4;
                foreach (var resgistro in comprasDeTarjeta.compras)
                {
                    pag.Cell(fila, 1).Value = resgistro.fecha;
                    pag.Cell(fila, 2).Value = resgistro.desc;
                    pag.Cell(fila, 3).Value = resgistro.monto;
                    fila++;
                }

                using (var stream = new MemoryStream())
                {
                    libro.SaveAs(stream);
                    stream.Seek(0, SeekOrigin.Begin);

                    return File(
                        stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Compras.xlsx"
                        );
                }
            }


        }
    }
}
