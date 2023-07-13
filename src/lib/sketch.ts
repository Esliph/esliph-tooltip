import { ObserverEvent } from './observer/index.js'

export type ElementType = HTMLElement | Node
export type ContentType = HTMLElement | Node
export type ElementTooltipType = HTMLElement | Node
export type TooltipEsliphOptions = {
    classTooltip?: string
    classTooltipActive?: string
}
export type TooltipEsliphEvent = {
    'creating/element/tooltip': { content: ContentType }
    'creating/element/teste': { content: ContentType }
}

const DEFAULT_TOOLTIP_OPTIONS: Required<TooltipEsliphOptions> = {
    classTooltip: 'tooltip-esliph',
    classTooltipActive: 'tooltip-esliph-active',
}

export class TooltipEsliph {
    element: HTMLElement
    content: ContentType
    elementTooltip: ElementTooltipType
    options: Required<TooltipEsliphOptions>
    private observer: ObserverEvent<'Tooltip', TooltipEsliphEvent>

    private constructor({ content, element }: { element: HTMLElement; content: ContentType }, options?: TooltipEsliphOptions) {
        this.element = element
        this.content = content
        // @ts-expect-error
        this.elementTooltip = null
        this.observer = new ObserverEvent<'Tooltip', TooltipEsliphEvent>('Tooltip')
        this.options = { ...DEFAULT_TOOLTIP_OPTIONS, ...options }

        this.initComponents()
    }

    public static newTooltip(selectorElement: string, content: ContentType | string, options?: TooltipEsliphOptions) {
        const element = TooltipEsliph.getElement(selectorElement)

        const tooltip = new TooltipEsliph(
            {
                content: TooltipEsliph.getElementInNode({ element: content }),
                element,
            },
            options
        )

        return tooltip
    }

    private static getElement(selectorElement: string) {
        const element = document.querySelector(selectorElement) as HTMLElement

        if (!element) {
            throw new Error(`Element "${selectorElement}" not found`)
        }

        return element
    }

    private updateTooltipElement() {}

    private initComponents() {
        this.createTooltipElement({
            content: this.content,
        })
        this.initComponentsTooltip()

        this.element.appendChild(this.elementTooltip)
    }

    public replaceTooltipElement(handler: (args: { content: ContentType }) => ElementTooltipType | string) {
        const elementTooltip = handler({ content: this.content })

        const elementTooltipInNode = TooltipEsliph.getElementInNode({ element: elementTooltip })

        // @ts-expect-error
        this.elementTooltip.remove()

        this.elementTooltip = elementTooltipInNode

        this.element.appendChild(this.elementTooltip)
    }

    private createTooltipElement({ content }: { content: ContentType }) {
        const tooltipElementParent = document.createElement('div')

        const contentNode = TooltipEsliph.getElementInNode({ element: content })

        tooltipElementParent.classList.add(this.options.classTooltip)

        tooltipElementParent.appendChild(contentNode)

        this.elementTooltip = tooltipElementParent

        return tooltipElementParent
    }

    private static getElementInNode({ element }: { element: ContentType | string }) {
        if (element instanceof Node) {
            return element
        }

        return document.createTextNode(element)
    }

    private static getElementInHTML({ element }: { element: ContentType | string }) {
        // @ts-expect-error
        return document as HTMLElement
    }

    private initComponentsTooltip() {}

    public on<Event extends keyof TooltipEsliphEvent>(eventName: Event, handler: (data: TooltipEsliphEvent[Event]) => void) {
        this.observer.on(eventName, handler)
    }
}
