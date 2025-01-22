namespace Backend_transacciones.Modelos
{
    public class TransaccionesModel
    {
        public Guid TransaccionID  {get;set;}
        public Guid TarjetaID {get;set;}
        public string Tipo {get;set;}
        public decimal Monto {get;set;}
        public DateTime Fecha {get;set;}
        public string Descripcion { get; set; }

        public virtual TarjetasModel TarjetaAsociada { get;set;}

    }
}
