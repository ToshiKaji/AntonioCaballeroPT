--creacion de tablas

Create Table Tarjetas (
TarjetaID binary not null,
Numero varchar(16),
NombresTitular varchar(50),
ApellidosTitular varchar(50),
Limite decimal,
PIC decimal, --Porcentaje Interés Configurable
PCSM decimal --Porcentaje Configurable Saldo Mínimo
, constraint PK_ID_Tarjeta Primary key (TarjetaID)
);


Create Table Transacciones (
TransaccionID binary not null,
TarjetaID binary not null,
Tipo varchar(1), --C para cargo o A para abono
Monto decimal,
Fecha date,
Descripcion text,
Constraint PK_ID_Transaccion Primary Key (TransaccionID),
constraint FK_Tarjeta_Transaccion Foreign Key (TarjetaID) references Tarjetas(TarjetaID)
);

--Datos iniciales 
INSERT INTO Tarjetas (TarjetaID, Numero, NombresTitular, ApellidosTitular, Limite, PIC, PCSM)
VALUES
(0x01, '1234567812345678', 'Juan', 'Pérez', 5000.00, 2.5, 5.0),
(0x02, '8765432187654321', 'Ana', 'López', 7500.00, 3.0, 4.0),
(0x03, '1122334455667788', 'Carlos', 'Ramírez', 10000.00, 1.8, 3.5);

INSERT INTO Transacciones (TransaccionID, TarjetaID, Tipo, Monto, Fecha, Descripcion)
VALUES
(0x01, 0x01, 'C', 200.00, '2025-01-15', 'Compra en supermercado'),
(0x02, 0x01, 'A', 500.00, '2025-01-18', ''),
(0x03, 0x02, 'C', 100.00, '2025-01-10', 'Recarga de gasolina'),
(0x04, 0x02, 'C', 300.00, '2025-01-12', 'Compra en tienda de ropa'),
(0x05, 0x03, 'A', 1500.00, '2025-01-05', ''),
(0x06, 0x03, 'C', 120.00, '2025-01-08', 'Compra de libros');