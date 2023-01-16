import { Socket } from 'src/core/socket';
import { Device } from 'src/core/device';
import { Hass } from 'src/core/hass';

export class Light extends Device {
  constructor(entityId: string, name: string) {
    super(entityId,name);
  }

  toggle(newState: Record<string,any> = {}) {
    console.debug(`[Light.toggle] ${this.name}(${this.entityId})`);
    Hass.callLightService('toggle',this.entityId, {...this.state, ...newState});
  }
}
