import React from "react"
import { createContext,useState } from "react"
export const DatosContext=createContext()
const ContextApp=({children})=>{
    const [productoObtenido,setProductoObtenido]=useState({})
    const data={
        productoObtenido,setProductoObtenido
    }
    return(
        <DatosContext.Provider value={data}>
            {children}
        </DatosContext.Provider>
    )
}
export default ContextApp