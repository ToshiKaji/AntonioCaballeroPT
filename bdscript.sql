--creacion de tablas

Create Table Tarjetas (
TarjetaID uniqueidentifier not null,
Numero varchar(16),
NombresTitular varchar(50),
ApellidosTitular varchar(50),
Limite decimal(18,5),
PIC decimal(18,5), --Porcentaje Interés Configurable
PCSM decimal(18,5) --Porcentaje Configurable Saldo Mínimo
, constraint PK_ID_Tarjeta Primary key (TarjetaID)
);


Create Table Transacciones (
TransaccionID uniqueidentifier not null,
TarjetaID uniqueidentifier not null,
Tipo varchar(1), --C para cargo o A para abono
Monto decimal(18,5),
Fecha date,
Descripcion text,
Constraint PK_ID_Transaccion Primary Key (TransaccionID),
constraint FK_Tarjeta_Transaccion Foreign Key (TarjetaID) references Tarjetas(TarjetaID)
);

--Datos iniciales 
-- Datos para la tabla Tarjetas
INSERT INTO Tarjetas (TarjetaID, Numero, NombresTitular, ApellidosTitular, Limite, PIC, PCSM)
VALUES
(NEWID(), '1234567812345678', 'Juan', 'Pérez', 5000.00, 0.02, 0.10),
(NEWID(), '8765432187654321', 'Ana', 'Gómez', 10000.00, 0.015, 0.12),
(NEWID(), '5678123456781234', 'Carlos', 'Hernández', 7500.00, 0.018, 0.08),
(NEWID(), '4321876543218765', 'María', 'López', 6000.00, 0.02, 0.11);

-- Datos para la tabla Transacciones
DECLARE @TarjetaID1 UNIQUEIDENTIFIER = (SELECT TOP 1 TarjetaID FROM Tarjetas WHERE Numero = '1234567812345678');
DECLARE @TarjetaID2 UNIQUEIDENTIFIER = (SELECT TOP 1 TarjetaID FROM Tarjetas WHERE Numero = '8765432187654321');
DECLARE @TarjetaID3 UNIQUEIDENTIFIER = (SELECT TOP 1 TarjetaID FROM Tarjetas WHERE Numero = '5678123456781234');
DECLARE @TarjetaID4 UNIQUEIDENTIFIER = (SELECT TOP 1 TarjetaID FROM Tarjetas WHERE Numero = '4321876543218765');

INSERT INTO Transacciones (TransaccionID, TarjetaID, Tipo, Monto, Fecha, Descripcion)
VALUES
(NEWID(), @TarjetaID1, 'C', 150.00, '2025-01-01', 'Compra en supermercado'),
(NEWID(), @TarjetaID1, 'A', 100.00, '2025-01-05', ''),
(NEWID(), @TarjetaID2, 'C', 250.00, '2025-01-02', 'Compra de electrodoméstico'),
(NEWID(), @TarjetaID2, 'A', 200.00, '2025-01-06', ''),
(NEWID(), @TarjetaID3, 'C', 50.00, '2025-01-03', 'Pago de estacionamiento'),
(NEWID(), @TarjetaID3, 'A', 75.00, '2025-01-07', ''),
(NEWID(), @TarjetaID4, 'C', 500.00, '2025-01-04', 'Compra de muebles'),
(NEWID(), @TarjetaID4, 'A', 400.00, '2025-01-08', '');

--Procedimiento alamcenado para la creacion de una nueva tarjeta 
create procedure NuevaTarjeta
	@numero varchar(16),
	@nombresT varchar(16),
	@apelllidosT varchar(16),
	@limite decimal(18,5),
	@pic decimal(18,5),
	@pcsm decimal(18,5)
	as begin
	set nocount on ;

	if LEN(@numero) <> 16 OR @numero is null
	begin
		RAISERROR('El numero de tarjeta debe ser de 16 digitos',16,1);
	end

	if LEN(@nombresT) < 1 OR @nombresT is null
	begin
		RAISERROR('Nombre muy corto',16,1);
	end

	if LEN(@apelllidosT) < 1 OR @apelllidosT is null
	begin
		RAISERROR('Apellidos muy cortos',16,1);
	end

	if @pic < 0  OR @pic = 0 or @pic is null
	begin
		RAISERROR('pic debe ser mayor que 0',16,1);
	end

	if @pcsm < 0  OR @pcsm = 0 or @pcsm is null
	begin
		RAISERROR('pcsm debe ser mayor que 0',16,1);
	end

	if @limite < 0  OR @limite = 0 or @limite is null
	begin
		RAISERROR('pcsm debe ser mayor que 0',16,1);
	end



	insert into Tarjetas(TarjetaID,Numero,NombresTitular,ApellidosTitular,Limite,PIC,PCSM)
	values(NEWID(),@numero,@nombresT,@apelllidosT,@limite,@pic,@pcsm);

	end;

--Prodimiento almacenado para la creacion de nuevas transacciones

create procedure NuevaTransaccion
	@tipo varchar(1),
	@monto decimal(18,5),
	@tarjeta uniqueidentifier,
	@fecha date,
	@descrip text 
	as begin
	set nocount on;

	if LEN(@tipo) <> 1 OR @tipo is null
	begin
		RAISERROR('El tipo es invalido',16,1);
	end

	if LEN(@monto) < 0 OR @monto is null
	begin
		RAISERROR('El monto es invalido',16,1);
	end

	if  @fecha is null
	begin
		RAISERROR('La fecha es invalido',16,1);
	end

	insert into Transacciones(TransaccionID,TarjetaID,Tipo,Monto,Fecha,Descripcion)
	values(NEWID(),@tarjeta,@tipo,@monto,@fecha,iif(@descrip is null,'',@descrip))
end
