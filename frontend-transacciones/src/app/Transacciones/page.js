'use client'
import { useEffect } from "react"
import { useState } from "react"
import {useContexto} from "../Contexto/contexto"
import axios from 'axios'
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { Toast, ToastContainer } from "react-bootstrap";

export default function Transacciones ()
{
    const {idGlobal} = useContexto() 
    const router = useRouter()
    const api = new axios.create({
        //defino la base de la api a la que hare las consultas
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        // con esto le digo que puedo controlar estos errores, fuera de estos
        // seran tratados como errores de conectividad
        validateStatus: function (status) {
      
          return status >= 200 && status < 300; 
      }})

      const hoy = new Date()
      const mesAntes = new Date( hoy )
      mesAntes.setMonth(hoy.getMonth() - 1)
      const [cargos,Setcargos] = useState([])
      
      const columnas = [
        {
            name: "ID de transaccion",
            selector: fila => fila.id

        },
        {
            name: "Fecha",
            selector: fila => fila.fecha

        },
        {
            name: "Descripcion",
            selector: fila => fila.descripcion

        },
        {
            name: "Cargo",
            selector: fila => fila.tipo == "C" ? "$"+fila.monto:""

        },
        {
            name: "Abono",
            selector: fila =>  fila.tipo == "A" ? "$"+fila.monto:""

        }
    ]

    const [estadoToast,SetestadoToast]= useState(false)
    const [notificacion,Setnotificacion] = useState({estilo:"",tipo:"",mensaje:""})

    const MostrarNotificacion = (estilo, tipo, mensaje) =>{
        Setnotificacion({estilo: estilo,tipo: tipo, mensaje: mensaje})
        SetestadoToast(!estadoToast)
   }

      const [info,Setinfo] = useState({})


    useEffect(() => {
        if(idGlobal != undefined){
            api.get("Tarjetas/Transacciones/"+idGlobal).then(res => {
                Setinfo(res.data)
                Setcargos(res.data.cargos)
            }).catch(function(error){
                MostrarNotificacion("success","Error","Error de conexion")
            })
        }else{
            router.push("/")
        }

        //Aqui mandamos a llamar la funcion que nos trae el estado de cuenta de nuestra tarjeta
    },[])
    return(
        <>
        <div className="container">
        <h3 className="text-center m-3">Transacciones</h3>
            <div className="row m-3">
                <div className="col-8">
                <div className="row">
                    <label className="label-control mb-2">Titular: {info.titular}</label>
                    <label className="label-control">Numero de tarjeta: {info.numero? info.numero.slice(0,4)+"****"+info.numero.slice(12):""}</label>
                </div>
                </div>
                
            </div>

            <div className="row">

            </div>
            <DataTable columns={columnas} data={cargos} pagination/>
            
        </div>

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
    )
}