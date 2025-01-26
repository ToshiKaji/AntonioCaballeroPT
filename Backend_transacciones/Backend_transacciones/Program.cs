using Backend_transacciones.DbContext;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);
CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

// Add services to the container.

builder.Services.AddDbContext<TransaccionesContext>(op =>
op.UseSqlServer(builder.Configuration.GetConnectionString("transacciones")));

//configurando fluentvalidation


//configurando cors para entorno de desarrollo
builder.Services.AddCors(op =>
{
    op.AddPolicy("desarrollo", politica =>
    {
        politica.WithOrigins("http://localhost:3000")
        .AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddFluentValidation(configuracion =>
        {
            configuracion.RegisterValidatorsFromAssemblyContaining<Program>();
        });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("desarrollo");// aqui le decimos que esta vamos a usar cuando sea desarrollo
}

app.UseHttpsRedirection();



app.UseAuthorization();

app.MapControllers();

app.Run();
