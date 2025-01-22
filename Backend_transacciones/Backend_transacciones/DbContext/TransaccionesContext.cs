
namespace Backend_transacciones.DbContext
{
    using Backend_transacciones.Modelos;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    public class TransaccionesContext : DbContext
    {
        public TransaccionesContext(DbContextOptions<TransaccionesContext> opciones) : base(opciones) { }

        public DbSet<TarjetasModel> Tarjetas { get; set; }
        public DbSet<TransaccionesModel> Transacciones { get; set; }

        public IQueryable<TransaccionesModel> TransaccionesDeTarjeta (string id)
        {
            return Transacciones.FromSqlRaw($"Select * from Transacciones where TarjetaID = {id}").AsNoTracking();
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
            });

            base.OnModelCreating(modelBuilder);


        }

    }
}
