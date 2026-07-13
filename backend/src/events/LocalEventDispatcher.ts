import { EventEmitter } from 'events';
import { EventDispatcher } from './EventDispatcher';

export class LocalEventDispatcher implements EventDispatcher {
  private emitter = new EventEmitter();

  async emit(event: string, payload: any): Promise<void> {
    this.emitter.emit(event, payload);
  }

  on(event: string, listener: (...args: any[]) => void): void {
    this.emitter.on(event, listener);
  }

  once(event: string, listener: (...args: any[]) => void): void {
    this.emitter.once(event, listener);
  }
}

export const eventDispatcher = new LocalEventDispatcher();
