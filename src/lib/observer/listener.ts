export function randomIdIntWithDate() {
    const VALUE_MAX = 9999
    const now = new Date()

    // @ts-expect-error
    const idString = `${now.getFullYear()}${`${now.getMonth() + 1}`.padStart(2, '0')}${`${Math.floor(Math.random() * VALUE_MAX)}`.padStart(
        `${VALUE_MAX}`.length,
        '0'
    )}`

    return Number(idString)
}


export type ObserverListenerModuleEvent = any

export type ObserverListenerImp = {
    handler: (data: any) => void
    event: ObserverListenerModuleEvent
    code: number
    context: string
    main: boolean
}

export class ObserverListener implements ObserverListenerImp {
    public readonly handler: (data: any) => void
    public event: ObserverListenerModuleEvent
    public code: number
    public context: string
    public main: boolean

    private constructor(event: ObserverListenerModuleEvent, handler: (data: any) => void, code: number, context = '', main = false) {
        this.handler = handler
        this.event = event
        this.code = code
        this.context = context
        this.main = main
    }

    public static onWithoutContext(event: ObserverListenerModuleEvent, handler: (data: any) => void) {
        const codeListenerWithoutContext = randomIdIntWithDate()

        const listenerWithoutContext = new ObserverListener(event, handler, codeListenerWithoutContext, '', false)

        return listenerWithoutContext
    }

    public static onWithContext(event: ObserverListenerModuleEvent, handler: (data: any) => void, context: string) {
        const codeListenerWithContext = randomIdIntWithDate()

        const listenerWithContext = new ObserverListener(event, handler, codeListenerWithContext, context, false)

        return listenerWithContext
    }

    public static onMainWithoutContext(event: ObserverListenerModuleEvent, handler: (data: any) => void) {
        const codeListenerWithoutContext = randomIdIntWithDate()

        const listenerWithoutContext = new ObserverListener(event, handler, codeListenerWithoutContext, '', true)

        return listenerWithoutContext
    }

    public static onMainWithContext(event: ObserverListenerModuleEvent, handler: (data: any) => void, context: string) {
        const codeListenerWithContext = randomIdIntWithDate()

        const listenerWithContext = new ObserverListener(event, handler, codeListenerWithContext, context, true)

        return listenerWithContext
    }
}
