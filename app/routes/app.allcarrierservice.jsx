import { useLoaderData } from '@remix-run/react';
import {authenticate} from '../shopify.server'
export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const carrierServices = await admin.rest.resources.CarrierService.all({ session: session });
  
    // Procesar los datos según sea necesario
    const processedData = carrierServices.map(service => {
        // Extraer y procesar la información necesaria
        return {
            id: service.id,
            name: service.name,
            callbackUrl: service.callback_url,
            // ... cualquier otro dato relevante
        };
    });
  
    return json({ carrierServices: processedData });
  };
  export default function CarrierServicesList() {
    const data = useLoaderData();
    if (!data || !data.carrierServices) {
        return <p>No se encontraron servicios de transporte.</p>;
    }

    return (
        <div>
            <h1>Carrier Services</h1>
            {data.carrierServices?.map(service => (
                <div key={service.id}>
                    <h2>{service.name}</h2>
                    <p>Callback URL: {service.callbackUrl}</p>
                    {/* Otros detalles del servicio */}
                </div>
            ))}
        </div>
    );
}