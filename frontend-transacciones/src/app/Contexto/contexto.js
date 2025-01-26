'use client'
import {useEffect, useState} from "react";
import  {useContext}  from "react";
import  {createContext}  from "react";
import { useRouter } from "next/navigation";
const MiContexto = createContext()

export function Proveedor({children}){
    const [idGlobal,SetidGlobal] = useState("")
    const router = useRouter()
    useEffect(()=>{
        if(!idGlobal){
            router.push("/")
        }
    },[])
    return(
        <MiContexto.Provider value={{idGlobal,SetidGlobal}}>
            {children}
        </MiContexto.Provider>
    )
}

export function useContexto() {
    return useContext(MiContexto)
}