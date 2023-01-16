import { Device } from 'src/core/device';

export const convertDevicesToEventDict = (devices: Device[]) => {
 return devices.reduce<Record<string,Device[]>>( (result,device) => {
    const eventTypes = Object.keys(device.events)
    return eventTypes.reduce((res,eventType) =>{
      const eventDevices = res[eventType] ?? [];
      return {...res, [eventType]: [...eventDevices,device]};
    },{...result});
  },{});
}

export const callEventHanlderForDevice = (eventType: string, device: Device, newState: Record<string,any>, oldState?: Record<string,any>) => {
  const callbacks = device.events[eventType];
  callbacks.forEach(clb => clb(newState,oldState));
}

