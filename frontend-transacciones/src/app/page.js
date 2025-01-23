'use client'
import  { useEffect, useState }  from "react";

import axios from "axios";
import DataTable from "react-data-table-component";

export default function Home() {

const api = new axios.create({
  //defino la base de la api a la que hare las consultas
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // con esto le digo que puedo controlar estos errores, fuera de estos
  // seran tratados como errores de conectividad
  validateStatus: function (status) {

    return status >= 200 && status < 300; 
}})

  const [tarjetas,Settarjetas] = useState([])

  const columnas = [{
    name: 'Numero',
    selector: fila => fila.numero
  },
  {
    name: 'Titular',
    selector: fila => fila.nombresTitular +" "+fila.apellidosTitular
  }
]
//este es el componente cuando se expande la fila de cada tarjeta
const menuExtendido = ({tarjeta}) => <div className="row"><button className="btn btn-primary col-1">btn1</button> <button className="btn btn-secondary col-1">btn3</button> <button className="btn btn-danger col-1">btn3</button> </div>


  //hacemos que se cargue las tarjetas al nomas abrir
  useEffect(() => {
      api.get("Tarjetas").then(res => {
        Settarjetas(res.data)
      })
  },[])
  return (
    <>
    <DataTable columns={columnas} data={tarjetas} expandableRows expandableRowsComponent={menuExtendido} pagination/>
    </>  
  );
}
