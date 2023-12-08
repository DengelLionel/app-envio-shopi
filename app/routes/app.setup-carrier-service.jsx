import {authenticate} from '../shopify.server'
export const action = async ({request}) => {
    const { admin, session } = await authenticate.admin(request);
const carrier_service = new admin.rest.resources.CarrierService({session: session});
carrier_service.name = "Shipping Rate Provider";
carrier_service.callback_url = "https://app-envio-shopi.vercel.app/app/shipping-rate";
carrier_service.service_discovery = true;
await carrier_service.save({
  update: true,
});

 
};
