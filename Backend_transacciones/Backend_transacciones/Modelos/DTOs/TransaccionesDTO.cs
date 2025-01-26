namespace Backend_transacciones.Modelos.DTOs
{
    public class TransaccionesDTO
    {
        public Guid ID { get; set; }
        public string Descripcion { get; set; }

        public string Tipo { get; set; }
        public string Fecha { get; set; }
        public decimal Monto { get; set; }
    }
}
