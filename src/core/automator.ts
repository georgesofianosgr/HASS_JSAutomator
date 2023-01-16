import {Socket} from './socket';
import { Light } from 'src/device/light';
import { Switch } from 'src/device/switch';
import { Device } from 'src/core/device';

export enum DeviceType {
  LIGHT = "LIGHT",
  SWITCH = "SWITCH",
}

export interface DeviceBlueprint {
  type: DeviceType,
  name: string,
  entityId: string,
}

export interface AutomationInput {
  Light: Record<string,Light>;
  Switch: Record<string,Switch>
}

export class Automator {
  static Light: Record<string,Light> = {};
  static Switch: Record<string,Switch> = {};
  static getDevices(): Device[] {
    const lights = Object.values(Automator.Light);
    const switches = Object.values(Automator.Switch);
    return [...lights,...switches];
  }
  static createDevices(deviceBlueprints: DeviceBlueprint[]) {
    console.debug(`[createDevices] Creating Devices`);
    deviceBlueprints.forEach(blueprint => {
      if(blueprint.type === DeviceType.LIGHT) {
        console.debug(`[createDevices] Creating Light ${blueprint.name}`);
        const device = new Light(blueprint.entityId, blueprint.name);
        Automator.Light[blueprint.name] = device;
      } else if(blueprint.type === DeviceType.SWITCH) {
        console.debug(`[createDevices] Creating Switch ${blueprint.name}`);
        const device = new Switch(blueprint.entityId, blueprint.name);
        Automator.Switch[blueprint.name] = device;
      }

    });
  }
  static async initialize() {
    await Socket.connect();
  }
}
