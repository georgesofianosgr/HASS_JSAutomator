import {Socket} from 'src/core/socket';

const callService = (domain: string, serviceName:string, optionalData: Record<string,any>) => {
      const message = {
        type: "call_service",
        domain: domain,
        service: serviceName,
        ...optionalData,
      }
      console.debug(`[callService] ${JSON.stringify(message)}`);
      Socket.sendMessage(message);
}

const callTargetService = (domain: string, serviceName:string, entityId: string, serviceData: Record<string,string>, optionalData: Record<string,any> = {}) => {
  callService(domain,serviceName,{target: {"entity_id": entityId},"service_data": serviceData, ...optionalData});
}

const callLightService = (serviceName:string,entityId: string,serviceData: Record<string,string> = {}) => {
  callTargetService('light',serviceName,entityId,serviceData);
}

const subscribeToEvent = async (eventType: Parameters<typeof Socket.subscribeEvents>[1], clb: Parameters<typeof Socket.subscribeEvents>[0]) => {
  return Socket.subscribeEvents(clb,eventType);
}


export const Hass = {
  callService,
  callTargetService,
  callLightService,
  subscribeToEvent,
}
