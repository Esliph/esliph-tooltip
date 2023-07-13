import { ElementContentType, ElementTargetType, ElementTooltipType, TolltipOptions } from './model.js'
import { DEFAULT_TOOLTIP_OPTIONS, TooltipStylesDefault, TooltipStylesDisable, TooltipStylesEnable } from './global.js'
import { ObserverTooltip } from './observer.js'

export class Tooltip extends ObserverTooltip {
    private elementTarget: ElementTargetType
    private elementTooltip: ElementTooltipType
    private options: TolltipOptions
    private content: ElementContentType
    private state: {
        isEnable: boolean
    }

    private constructor(elementTarget: ElementTargetType, content: ElementContentType, options?: Partial<TolltipOptions>) {
        super()
        this.elementTarget = elementTarget
        // @ts-expect-error
        this.elementTooltip = null
        this.content = content
        this.options = Tooltip.mergeOptions(options)
        this.state = {
            isEnable: false,
        }
    }

    public static create(args: { content: ElementContentType | string | Node; options?: Partial<TolltipOptions> }) {
        const options = Tooltip.mergeOptions(args?.options || {})

        const contentInHTMLElement = Tooltip.getStringNodeInHTMLElement(args.content)

        const elementTarget = Tooltip.getElementTarget(options.selectorElementTarget || '')

        const tooltip = new Tooltip(elementTarget, contentInHTMLElement, options)

        tooltip.initComponents()

        return tooltip
    }

    private static getStringNodeInHTMLElement(arg: ElementContentType | string | Node) {
        return arg as HTMLElement
    }

    private static getDefaultOptions() {
        return { ...DEFAULT_TOOLTIP_OPTIONS }
    }

    private static mergeOptions(options?: Partial<TolltipOptions>) {
        return { ...Tooltip.getDefaultOptions(), ...options }
    }

    private static getElementTarget(selectorElementTarget: string | HTMLElement | Element) {
        if (!selectorElementTarget) {
            return null
        }
        if (selectorElementTarget instanceof HTMLElement || selectorElementTarget instanceof Element) {
            return selectorElementTarget as HTMLElement
        }

        const elementTarget = document.querySelector(selectorElementTarget || '')

        return elementTarget as ElementTargetType
    }

    private initComponents() {
        this.createTooltip()
        this.initEvents()
    }

    private createTooltip() {
        const tooltipElement = document.createElement('div')

        tooltipElement.classList.add(this.getFullOptions().classTooltip)
        if (this.content instanceof HTMLElement) {
            tooltipElement.appendChild(this.content)
        } else {
            tooltipElement.innerHTML = this.content
        }

        this.elementTooltip = tooltipElement

        Tooltip.setStylesInElement(this.elementTooltip, TooltipStylesDefault)

        this.toggleTooltip(false)

        if (this.elementTarget) {
            this.elementTarget.appendChild(this.elementTooltip)
        }
    }

    private initEvents() {
        if (!this.elementTarget) {
            return
        }

        this.elementTarget.addEventListener('mouseenter', () => this.hoverInElement())
        this.elementTarget.addEventListener('mouseleave', () => this.houverOutElement())
        this.elementTarget.addEventListener('mousemove', () => this.mouseMouveInElementTarget())
    }

    private hoverInElement() {
        this.toggleTooltip(true)
    }

    private houverOutElement() {
        this.toggleTooltip(false)
    }

    private mouseMouveInElementTarget() {
        if (this.getFullOptions().typePosition != 'float') {
            return
        }
    }

    public toggleTooltip(forceState?: boolean) {
        if (typeof forceState != 'undefined') {
            this.state.isEnable = forceState
        } else {
            this.state.isEnable = !this.state.isEnable
        }

        this.elementTooltip.classList.toggle(this.getFullOptions().classEnable, this.state.isEnable)
        this.elementTooltip.classList.toggle(this.getFullOptions().classDisable, !this.state.isEnable)

        if (this.state.isEnable) {
            this.showTooltip()
        } else {
            this.hiddenTooltip()
        }
    }

    public showTooltip() {
        Tooltip.setStylesInElement(this.elementTooltip, TooltipStylesEnable)
    }

    public hiddenTooltip() {
        Tooltip.setStylesInElement(this.elementTooltip, TooltipStylesDisable)
    }

    private static setStylesInElement(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
        for (const styleName in styles) {
            // @ts-expect-error
            element.style[styleName] = styles[styleName]
        }
    }

    private getFullOptions() {
        return { ...Tooltip.getDefaultOptions(), ...this.options }
    }

    public getOptions() {
        return { ...this.options }
    }

    public getElementTarget() {
        return { ...this.elementTarget }
    }

    public getElementTooltip() {
        return { ...this.elementTooltip }
    }
}
