'use client'
import { useEffect } from "react"
import { useState } from "react"
import {useContexto} from "../Contexto/contexto"
import { Toast, ToastContainer } from "react-bootstrap";
import axios from 'axios'
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";

export default function EstadoDeCuenta ()
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
            name: "Monto de la operacion",
            selector: fila => "$"+fila.monto

        }
    ]

    const [estadoToast,SetestadoToast]= useState(false)
    const [notificacion,Setnotificacion] = useState({estilo:"",tipo:"",mensaje:""})

    const MostrarNotificacion = (estilo, tipo, mensaje) =>{
        Setnotificacion({estilo: estilo,tipo: tipo, mensaje: mensaje})
        SetestadoToast(!estadoToast)
   }

      const [info,Setinfo] = useState({})

      const Exportar = () => {
        api.get("Transacciones/ExportarTransacciones/"+idGlobal, {
            responseType: "blob", 
          }).then(res =>{
            if(res.status == 200){

                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "Compras.xlsx"); // Nombre del archivo
                document.body.appendChild(link);
                link.click();
                link.remove();
                MostrarNotificacion("success","Exito","Compras exportadas con exito!")
            }
        }).catch(function(error){
            MostrarNotificacion("success","Error","Error de conexion")
        })
      }


    useEffect(() => {
        if(idGlobal != undefined){
            api.get("Tarjetas/EstadoDeCuenta/"+idGlobal).then(res => {
                if(res.status == 200){
                Setinfo(res.data)
                Setcargos(res.data.cargos)
                }
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
        <h3 className="text-center m-3">Estado de cuenta </h3>
            <div className="row m-3">
                <div className="col-8">
                <div className="row">
                    <label className="label-control mb-2">Titular: {info.titular}</label>
                    <label className="label-control">Numero de tarjeta: {info.numero? info.numero.slice(0,4)+"****"+info.numero.slice(12):""}</label>
                    <button type="button" className="btn btn-primary col-6 mt-3" onClick={e => Exportar()}>Exportar compras</button>
                </div>
                </div>
                <div className="col-4">
                    <div className="row">
                        <label className="label-control mb-2">Saldo actual: {"$"+info.saldoActual}</label>
                        <label className="label-control mb-2">Limite: {"$"+info.limite}</label>
                        <label className="label-control mb-2">Interes bonificable: {"$"+info.interesB}</label>
                        <label className="label-control mb-2">Cuota minima a pagar: {"$"+info.cuotaMinima}</label>
                        <label className="label-control mb-2">Pago de contado con intereses: {"$"+info.montoTotalIntereses}</label>
                        <label className="label-control mb-2">Saldo disponible: {"$"+info.disponible}</label>
                    </div>
                </div>
            </div>

            <div className="row">

            </div>
            <DataTable columns={columnas} data={cargos} pagination/>
            <div className="row">
                <div className="col-2">
                    <label className="label-control">Compras de { mesAntes.toLocaleString("es-ES", { month: "long" })}: {"$"+info.saldoMesAnterior}</label>
                </div>
                <div className="col-2">
                    <label className="label-control">Compras de { hoy.toLocaleString("es-ES", { month: "long" }) }: {"$"+info.saldoActual}</label>
                </div>
            </div>
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