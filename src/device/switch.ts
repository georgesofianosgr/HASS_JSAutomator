import { type EventCallback, Device } from 'src/core/device';

export type SwitchPressEventCallback = (pressType: string, newState: Record<string,any>,oldState?: Record<string,any>) => void;

/* Switch is any device has a sensor.$NAME_action id */
export class Switch extends Device {
  events: Record<string,Function[]> = {};
  constructor(entityId: string,name: string) {
    super(entityId,name)
  }

  onLeftPress(clb: EventCallback) {
    const pressClb = (newState: Record<string,any>,oldState?: Record<string,any>) => {
        if(newState.state === "single_left") {
          console.debug(`[Switch.onLeftPress] ${this.name}(${this.entityId})`);
          clb(newState,oldState);
        }
      };

    this.addEvent('state_changed',pressClb);
  }

  onRightPress(clb: EventCallback) {
    const pressClb = (newState: Record<string,any>,oldState?: Record<string,any>) => {
        if(newState.state === "single_right") {
          console.debug(`[Switch.onRightPress] ${this.name}(${this.entityId})`);
          clb(newState,oldState);
        }
      };

    this.addEvent('state_changed',pressClb);
  }

  onSinglePress(clb: EventCallback) {
    const pressClb = (newState: Record<string,any>,oldState?: Record<string,any>) => {
        if(newState.state === "single") {
          console.debug(`[Switch.onSinglePress] ${this.name}(${this.entityId})`);
          clb(newState,oldState);
        }
      };

    this.addEvent('state_changed',pressClb);
  }
  onPress(clb: SwitchPressEventCallback) {
    const pressClb = (newState: Record<string,any>,oldState?: Record<string,any>) => {
        if(oldState?.state !== newState.state && newState.state !== "") {
          console.debug(`[Switch.onPress] ${newState.state} ${this.name}(${this.entityId})`);
          clb(newState.state,newState,oldState);
        }
      };

    this.addEvent('state_changed',pressClb);
  }
}
