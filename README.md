
# Backend y frontend de transacciones

En este repositorio se encuentran tanto el frontend como el backend para una pequeña solucion para poder ingresar pagos y cargos en base a una tarjeta de credito la cual posee parametos configurables bajo los cuales se hacen los calculos de las cuotas minimas en intereses para la misma, asi como la posibilidad de exportar las compras.



## Documentacion

En general para el consumo de la api se encuentran en el mismo repositorios una coleccion de postman asi como tambien en el mismo esta implementado swagger.

Tambien deje un preceso almacenado en la BD para al creacion de tarjetas nuevas por si se desea agregar mas registros en la tabla de Tarjetas


## Installation

importante 

-Tener instalado un .NET sdk 8.0 (o superior)

-Tener node 18.18 minimo


Luego de clonar el repositorio:

### En visual studio ejecutar
```bash
  dotnet restore
  dotnet build
```

### En VScode (si es el caso) dentro de 'frontend-transacciones' ejecutar
```bash
  npm install
```
### En SQL ejecutar el script para crear las tablas e ingresas datos iniciales*

## Author

- [@ToshiKaji](https://github.com/ToshiKaji) (Antonio Caballero)

