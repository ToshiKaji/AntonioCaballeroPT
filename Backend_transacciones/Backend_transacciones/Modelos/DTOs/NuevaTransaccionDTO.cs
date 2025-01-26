using Backend_transacciones.Modelos.ValidacionesPersonalizadas;
using System.ComponentModel.DataAnnotations;

namespace Backend_transacciones.Modelos.DTOs
{
    public class NuevaTransaccionDTO
    {
        public Guid Tarjeta {  get; set; }
        public string Tipo {  get; set; }
        public string Descripcion { get; set; }
        public decimal Monto { get; set; }

        public DateTime Fecha { get; set; } 
    }
}
