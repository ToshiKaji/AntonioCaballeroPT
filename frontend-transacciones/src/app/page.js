'use client'
import  { useEffect, useRef, useState }  from "react";

import axios from "axios";
import DataTable from "react-data-table-component";
import { Form, Modal, Toast, ToastContainer } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useContexto } from "./Contexto/contexto";

export default function Home() {

const hoy = new Date()//increible lo que tiene hacer uno para usar el formato correcto para la fecha xdd

const {SetidGlobal} = useContexto()
const router = useRouter()
const api = new axios.create({
  //defino la base de la api a la que hare las consultas
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // con esto le digo que puedo controlar estos errores, fuera de estos
  // seran tratados como errores de conectividad
  validateStatus: function (status) {

    return status >= 200 && status <= 300; 
}})

  const monto = useRef()
  const descripcion = useRef()
  const fecha = useRef()

  const [tarjetas,Settarjetas] = useState([])
  const [tarjetaId,SettarjetaId] = useState("")

  const [errores,Seterrores] = useState([])

  const columnas = [{
    name: 'Numero',
    selector: fila => ManipulacionDeNumerotarjeta(fila.numero)
  },
  {
    name: 'Titular',
    selector: fila => fila.nombresTitular +" "+fila.apellidosTitular
  },
  {
    name: 'Limite',
    selector: fila => "$"+fila.limite
  }
]
 const ManipulacionDeNumerotarjeta = (num) =>{
      const primeros = num.slice(0,4)
      const finales = num.slice(12)
      return primeros + "****" + finales
 }
//con estos vamos a controlar el estado de los modales para agregar pagos/compras a las tarjetas
 const [estadoModalCompras,SetestadoModalCompras]= useState(false)
 const [estadoModalPagos,SetestadoModalPagos]= useState(false)

 const [estadoToast,SetestadoToast]= useState(false)
 const [notificacion,Setnotificacion] = useState({estilo:"",tipo:"",mensaje:""})

 //ir al estado de cuenta 
 const IrEstadoDeCuenta = (id) =>{
  SetidGlobal(id)
  router.push("/EstadoDeCuenta")
 }

 const Irtransacciones = (id) => {
  SetidGlobal(id)
  router.push("/Transacciones")
 }

 const MostrarNotificacion = (estilo, tipo, mensaje) =>{
      Setnotificacion({estilo: estilo,tipo: tipo, mensaje: mensaje})
      SetestadoToast(!estadoToast)
 }

 const IngresarCompra = () => {
  
      if(monto.current.value && monto.current.value > 0 )
      {
        
        //es un monto valido
        if(descripcion.current.value && descripcion.current.value != "" )
        {
          const transaccion = {
            tarjeta: tarjetaId,
            tipo: "C",
            monto: monto.current.value,
            descripcion: descripcion.current.value,
            fecha: fecha.current.value
          }

          api.post("Transacciones/Cargo",transaccion).then(res =>{
            if(res.status = 200){
              SetestadoModalCompras(!estadoModalCompras)
              MostrarNotificacion("success","Exito","Compra registrada con exito!")
              monto.current.value = 0
              descripcion.current.value = ""
            }
          }).catch(function(error){

            if (error.response) {
              const { errors, tipoError} = error.response.data;
                console.log(error.response.data)
                console.log(tipoError)
        
               // Procesar los errores
               if (tipoError !== "logico"){
                console.log(errors)
                for (const field in errors) {
                  if (errors.hasOwnProperty(field)) {
                    MostrarNotificacion("danger","error",`Campo: ${field}, Mensajes: ${errors[field].join(", ")}`)
                    //console.error(`Campo: ${field}, Mensajes: ${errors[field].join(", ")}`);
                  }
                }
              }else{
                console.log(errors)
                MostrarNotificacion("danger","error",`Campo: ${errors.campo}, Mensajes: ${errors.msg}`)
              }

            }else{
              MostrarNotificacion("danger","error","Error de conexion.")
            }
          })


          
        }else{
          MostrarNotificacion("warning","Error en descripcion","Debe contener una descripcion")
        }
      }else{
        MostrarNotificacion("warning","Error en monto","El monto ingresado no es valido")
      }
 }

 const IngresarPago = () => {
  
  if(monto.current.value && monto.current.value > 0 )
    {
      //aqui llamamos a la api
      const transaccion = {
        tarjeta: tarjetaId,
        tipo: "A",
        monto: monto.current.value,
        descripcion: "",
        fecha: fecha.current.value
      }

      api.post("Transacciones/Pago",transaccion).then(res =>{
        if(res.status = 200){
          SetestadoModalPagos(!estadoModalPagos)
          MostrarNotificacion("success","Exito","Pago registrado con exito!")
          monto.current.value = 0
          
        }
      }).catch(function(error){

        if (error.response) {
          const { errors, tipoError} = error.response.data;
            console.log(error.response.data)
            console.log(tipoError)
    
           // Procesar los errores
           if (tipoError !== "logico"){
            console.log(errors)
            for (const field in errors) {
              if (errors.hasOwnProperty(field)) {
                MostrarNotificacion("danger","error",`Campo: ${field}, Mensajes: ${errors[field].join(", ")}`)
                //console.error(`Campo: ${field}, Mensajes: ${errors[field].join(", ")}`);
              }
            }
          }else{
            console.log(errors)
            MostrarNotificacion("danger","error",`Campo: ${errors.campo}, Mensajes: ${errors.msg}`)
          }

        }else{
          
          MostrarNotificacion("danger","error","Error de conexion.")
        }
      })
        
      
    }else{
      MostrarNotificacion("warning","Error en monto","El monto ingresado no es valido")
    }
 }


//este es el componente cuando se expande la fila de cada tarjeta
const menuExtendido = (tarjeta) => { return(
<div className="row justify-content-around m-2"><button onClick={e => IrEstadoDeCuenta(tarjeta.data.tarjetaID)} className="btn btn-sm btn-success col-2">Estado de cuenta</button> <button onClick={e =>{ SetestadoModalCompras(true), SettarjetaId(tarjeta.data.tarjetaID) }} className="btn btn-sm btn-secondary col-2">Agregar compra</button> <button onClick={e =>{ SetestadoModalPagos(true), SettarjetaId(tarjeta.data.tarjetaID) }} className="btn btn-sm btn-secondary col-2">Agregar pago</button> <button onClick={e => Irtransacciones(tarjeta.data.tarjetaID)} className="btn btn-sm btn-primary col-2">Transacciones</button></div>
)
}


  //hacemos que se cargue las tarjetas al nomas abrir
  useEffect(() => {
      api.get("Tarjetas").then(res => {
        Settarjetas(res.data)
      }).catch(function(error){
        MostrarNotificacion("danger","error","Error de conexion.")
      })
  },[])
  return (
    <>
    <DataTable columns={columnas} data={tarjetas} expandableRows expandableRowsComponent={menuExtendido} pagination/>
    
    <Modal show={estadoModalCompras} size="md" centered>
      <Modal.Header>
        <Modal.Title>Registrar compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Fecha</Form.Label>
          <Form.Control ref={fecha} type="date" defaultValue={`${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`}/>
          
        </Form.Group>

        <Form.Group>
          <Form.Label>Monto</Form.Label>
          <Form.Control ref={monto} type="number" />
        </Form.Group>

        <Form.Group>
          <Form.Label>Descripcion</Form.Label>
          <Form.Control ref={descripcion} as={"textarea"} rows={3}/>
        </Form.Group>
        
        <Form.Group className="mt-3">
            <button type="button" className="btn btn-success col-12" onClick={e => IngresarCompra()}>Registrar</button>
        </Form.Group>
      </Form>

      </Modal.Body>
      <Modal.Footer>
        <button  onClick={e => SetestadoModalCompras(!estadoModalCompras)} className="btn btn-danger">Cancelar</button>
      </Modal.Footer>
    </Modal>

    <Modal show={estadoModalPagos} size="md" centered>
      <Modal.Header>
        <Modal.Title>Registrar pago</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Fecha</Form.Label>
          <Form.Control ref={fecha} type="date" defaultValue={`${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`}/>
          
        </Form.Group>

        <Form.Group>
          <Form.Label>Monto</Form.Label>
          <Form.Control ref={monto} type="number" />
        </Form.Group>

        
        <Form.Group className="mt-3">
            <button type="button" className="btn btn-success col-12" onClick={e => IngresarPago()}>Registrar</button>
        </Form.Group>
      </Form>
      
      </Modal.Body>
      <Modal.Footer>
        <button onClick={e => SetestadoModalPagos(!estadoModalPagos)} className="btn btn-danger">Cancelar</button>
      </Modal.Footer>
    </Modal>

    <ToastContainer className="p-3" position={"top-end"}
          style={{ zIndex: 1100 }}>

      <Toast onClose={e => SetestadoToast(!estadoToast)} bg={notificacion.estilo} show={estadoToast} delay={3000} autohide>
        <Toast.Header >
          {notificacion.tipo}
        </Toast.Header>
          <Toast.Body>
            {notificacion.mensaje}
          </Toast.Body>
        
      </Toast>
    </ToastContainer>


    </>  
  );
}
