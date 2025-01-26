
namespace Backend_transacciones.DbContext
{
    using Backend_transacciones.Modelos;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Data.SqlClient;
    using Microsoft.EntityFrameworkCore;
    public class TransaccionesContext : DbContext
    {
        public TransaccionesContext(DbContextOptions<TransaccionesContext> opciones) : base(opciones) { }

        public DbSet<TarjetasModel> Tarjetas { get; set; }
        public DbSet<TransaccionesModel> Transacciones { get; set; }

        public async Task IngresarTransaccion(string tipo, Guid tarjeta, decimal monto, string desc, DateTime fecha)
        {
            var parametroTipo = new SqlParameter("@tipo", tipo);
            var parametroTarjeta = new SqlParameter("@tarjeta", tarjeta);
            var parametroMonto = new SqlParameter("@monto", monto);
            var parametrofecha = new SqlParameter("@fecha", fecha);
            var parametroDescripcion = new SqlParameter("@descrip", desc);

            await this.Database.ExecuteSqlRawAsync(
                "EXEC NuevaTransaccion @tipo,@monto,@tarjeta,@fecha,@descrip",
                parametroTipo, parametroMonto, parametroTarjeta, parametrofecha, parametroDescripcion
                );
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            //Aqui podemos definir como sera posible el recorrido de las entidades lo que arquitecturas mas robustas permite la contruccion de \
            //de queries mas robustas y complejas con mayor facilidad y control 

            modelBuilder.Entity<TarjetasModel>(trj =>
            {
                trj.HasKey(tarjeta => tarjeta.TarjetaID);

                trj.HasMany(tarjeta => tarjeta.TransaccionesDeTarjeta)
                .WithOne(transaccion => transaccion.TarjetaAsociada);
            });

            modelBuilder.Entity<TransaccionesModel>(trs =>
            {
                trs.HasKey(transaccion => transaccion.TransaccionID);
                trs.HasOne(transaccion => transaccion.TarjetaAsociada).WithMany(tarjeta => tarjeta.TransaccionesDeTarjeta).HasForeignKey(transac=> transac.TarjetaID);
            });

            base.OnModelCreating(modelBuilder);


        }

    }
}
