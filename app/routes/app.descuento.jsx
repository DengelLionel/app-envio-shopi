import React, {useContext, useEffect } from 'react'
import {json} from '@remix-run/node'
import {useActionData,useLoaderData,useSubmit} from '@remix-run/react'
import {authenticate} from '../shopify.server'
import {Button,Form} from "@shopify/polaris"
import {DatosContext} from '../context/contextapp'

export async function loader({ request }){
  const { admin} = await authenticate.admin(request);
  const datosProducto = await getProducts(admin.graphql);
  return datosProducto
}

export async function action({request}){
const { admin } = await authenticate.admin(request);
const idProducto=await request.formData()

let idfinal={id:idProducto.get("id")}
console.log("id seleccionado para update",idfinal )
const prod = await admin.graphql(
`
mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
      title
    }
    userErrors {
      field
      message
    }
  }
}
`,
  {
    variables: {
      input: {
        id:`${idfinal.id}`,
        title:`NUevo producto probando`,
      },
    }
  }
);

  const responseJson = await prod.json();

  return json({
    product: responseJson.data.productUpdate.product,
    error:responseJson.data.productUpdate.usersErrors,
  })

}
  


export const getProducts = async (graphql) => {
  const product = await graphql(
    `
    {
      products(first: 25) {
        nodes {
          id
          title
          description
        
          }
        }
      
    }`
  );

  const {
    data: {
      products: { nodes },
    },
  } = await product.json();

  return json(nodes);
}
const Descuento = () => {
 const {productoObtenido,setProductoObtenido}=useContext(DatosContext)
const data=useLoaderData()
const actiond=useActionData()
const submit=useSubmit()
const selectProduct=async()=>{
  const product=await window.shopify.resourcePicker({
    type:'product',
    action:'select'
  })

  if(product){
    const {id,title,description}=product[0]

    setProductoObtenido({
      id:id,
      title:title,
      description:description
    })
   
  }
  

}

const productId=actiond?.product?.id

useEffect(()=>{
if(productId){
  shopify.toast.show("Producto actualizado")
}
},[productId])
console.log("productos", data);
console.log("producto seleccionado", productoObtenido.id);
const datas={id:productoObtenido.id??""}
const uddtProduct = () => submit(datas, { method: "PUT" });

  return (
    <div>
      <Button onClick={()=>{submit(selectProduct())}}>
                     SELECCIONAR PRODUCTO
                    </Button>
                    <Form method="put" onSubmit={uddtProduct}>
                      <input type="text" disabled={true} value={productoObtenido.id&&productoObtenido.id}  name='id' />
                    <Button submit>
                    ACTUALIZAR PRODUCTO
                    </Button>
                    </Form>
                   
                    
                    {actiond?.product && (
                    <Button
                      url={`shopify:admin/products/${productId}`}
                      target="_blank"
                    >
                      Ver producto actualizado
                    </Button>
                  )}
    </div>
  )
}

export default Descuento