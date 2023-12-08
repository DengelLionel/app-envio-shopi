import React from 'react'
import {Button,TextField,Form,Page,Grid,LegacyCard} from "@shopify/polaris"
import CarrierServicesList from './app.allcarrierservice'

const Registro_carrier = () => {

  return (
    <Page fullWidth>
        <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
        <LegacyCard title="Detalles de la zona" sectioned>
            <p>
Asigna un nombre a la zona y especifica qué códigos postales están incluidos. Una vez hayas creado tu zona podrás añadir las tarifas.
            </p>
          </LegacyCard>
         </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
      
        <Form action="/app/setup-carrier-service" method="post">
                <Button submit={true} >Crear Carrier Service</Button>
            </Form>
            <CarrierServicesList/>
             </Grid.Cell>
        
        </Grid>
      
    </Page>
  )
}

export default Registro_carrier