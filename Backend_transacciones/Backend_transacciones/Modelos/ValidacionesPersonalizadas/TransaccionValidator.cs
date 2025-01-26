using Backend_transacciones.Modelos.DTOs;
using FluentValidation;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace Backend_transacciones.Modelos.ValidacionesPersonalizadas
{
    public class TransaccionValidator : AbstractValidator<NuevaTransaccionDTO>
    {
        public TransaccionValidator()
        { 
            //es el unico modelo con validacion dado que no hago post de ningun otro objeto 
            var hoy = DateTime.Now;

            RuleFor(transac => transac.Tipo)
                .NotEmpty().WithMessage("Es un campo requerido, por favor ingrese uno")
                .Length(1).WithMessage("El 'tipo' es un campo de un 1 caracter de largo")
                .Must(tipo => tipo.Equals("A") || tipo.Equals("C")).WithMessage("El 'tipo' solo puede ser 'C' o 'A'.");

            RuleFor(transac => transac.Monto)
                .NotNull().WithMessage("Es un campo requerido, por favor ingrese un monto")
                .NotEmpty().WithMessage("Es un campo requerido, por favor ingrese un monto")
                .GreaterThan(0).WithMessage("El monto debe ser mayor a 0 para que sea valido");

            RuleFor(transac => transac.Fecha)
                .NotNull().WithMessage("La fecha no puede ir vacia.")
                .NotEmpty().WithMessage("La fecha no puede ir vacia.")
                .InclusiveBetween(hoy.AddMonths(-1), hoy).WithMessage($"Solo se pueden ingresar compras entre las fechas de {hoy.AddMonths(-1).ToShortDateString()} y {hoy.ToShortDateString()}");

            RuleFor(transac => transac.Tarjeta)
                .NotEmpty().WithMessage("Es un campo requerido")
                .NotNull().WithMessage("Es un campo requerido");
        }

    }
}
