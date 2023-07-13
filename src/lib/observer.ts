import { ObserverEvent } from './observer/index.js'

export type ObserverTooltipEvents = {
    'build/tooltip': {}
}

export class ObserverTooltip {
    protected observer: ObserverEvent<'Tooltip', ObserverTooltipEvents>

    constructor() {
        this.observer = new ObserverEvent('Tooltip')
    }

    on<EventName extends keyof ObserverTooltipEvents>(eventName: EventName, handler: (data: ObserverTooltipEvents[EventName]) => void) {
        this.observer.on(eventName, handler)
    }

    protected onMain<EventName extends keyof ObserverTooltipEvents>(eventName: EventName, handler: (data: ObserverTooltipEvents[EventName]) => void) {
        this.observer.onMain(eventName, handler)
    }

    protected async emit<EventName extends keyof ObserverTooltipEvents>(eventName: EventName, data: ObserverTooltipEvents[EventName]) {
        await this.observer.emitToEvent(eventName, data)
    }

    removeListener(code: number) {
        this.observer.removeListenerByCode(code)
    }

    removeListeners(event: keyof ObserverTooltipEvents) {
        this.observer.removeListenersByEvent(event)
    }
}
