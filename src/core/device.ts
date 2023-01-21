export type EventCallback = (newState: Record<string,any>,oldState?: Record<string,any>) => void;
export type Event = 'state_changed' | 'other';

export class Device {
  entityId: string;
  name: string;
  events: Record<string,Function[]> = {};
  state: Record<string,string | number> = {}
  constructor(entityId: string,name: string) {
    this.entityId = entityId;
    this.name = name;
  }
  addEvent(eventName: Event, callback: EventCallback) {
    console.debug(`[Device.addEvent] ${eventName} handler registered for ${this.name}`);
    const eventCallbacks = this.events[eventName] ?? [];
    this.events[eventName] = [
      ...eventCallbacks,
      callback,
    ];
  }
  getEventTypes() {
    return Object.keys(this.events);
  }
  setState(updateState: Record<string,string | number>) {
    // TODO: remove state if nil
    this.state = {...this.state, ...updateState};
  }

  isEntity(entityId: string) {
    return this.entityId === entityId;
  }
}
