namespace Backend_transacciones.Modelos.DTOs
{
    public class EstadoDeCuentaDTO
    {
        public Guid ID {get; set; }
        public string Titular {get; set; }
        public string Numero {get; set; }
        public decimal SaldoActual {get; set; }
        public decimal SaldoMesAnterior { get; set; }
        public decimal Limite { get; set; }
        public decimal InteresB { get; set; }
        public decimal Disponible { get; set; }
        public decimal CuotaMinima { get; set; }
        public decimal MontoTotalIntereses { get; set; }


        public IEnumerable<TransaccionesDTO> Cargos { get; set; }

        



    }
}
