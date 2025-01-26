namespace Backend_transacciones.Modelos
{
    public class TarjetasModel
    {
        public Guid TarjetaID {get;set;}
        public string Numero {get;set;}
        public string NombresTitular {get;set;}
        public string ApellidosTitular {get;set;}
        public decimal Limite {get;set;}
        public decimal PIC {get;set;}
        public decimal PCSM { get; set; }
         //para poder recorrer las transacciones de forma mas facil
        public ICollection<TransaccionesModel> TransaccionesDeTarjeta { get;set;} 
        
    }
}
