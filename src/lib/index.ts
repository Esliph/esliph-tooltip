import { ElementContentType, ElementTargetType, ElementTooltipType, EnumTooltipDirections, PartialObjet, TooltipDirections, TooltipOptions } from './model.js'
import { DEFAULT_TOOLTIP_OPTIONS, ElementTargetStylesDefault, ElementTargetStylesIfTypeFixedDefault, TooltipStylesDefault, TooltipStylesDisable, TooltipStylesEnable, TooltipStylesFixed } from './global.js'
import { ObserverTooltip } from './observer.js'

export class Tooltip extends ObserverTooltip {
    private elementTarget: ElementTargetType
    private elementTooltip: ElementTooltipType
    private options: TooltipOptions
    private content: ElementContentType
    private state: { isEnable: boolean }

    private constructor(elementTarget: ElementTargetType, content: ElementContentType, options?: PartialObjet<TooltipOptions>) {
        super()
        this.elementTarget = elementTarget
        // @ts-expect-error
        this.elementTooltip = null
        this.content = content
        // @ts-expect-error
        this.options = Tooltip.mergeOptions(options)
        this.state = { isEnable: false }
    }

    public static create(args: { content: ElementContentType | string | Node; options?: PartialObjet<TooltipOptions> }) {
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
        return { ...DEFAULT_TOOLTIP_OPTIONS } as TooltipOptions
    }

    private static mergeOptions(options?: PartialObjet<TooltipOptions>) {
        return { ...Tooltip.getDefaultOptions(), ...options }
    }

    private static getElementTarget(selectorElementTarget: string | HTMLElement | Element) {
        if (!selectorElementTarget) { return null }
        if (selectorElementTarget instanceof HTMLElement || selectorElementTarget instanceof Element) { return selectorElementTarget as HTMLElement }

        const elementTarget = document.querySelector(selectorElementTarget || '')

        return elementTarget as ElementTargetType
    }

    private initComponents() {
        this.setupElementTarget()
        this.createTooltip()
        this.initEvents()
    }

    private setupElementTarget() {
        if (!this.elementTarget) { return }

        Tooltip.setStylesInElement(this.elementTarget, ElementTargetStylesDefault)

        if (!this.isTypeFloating()) {
            Tooltip.setStylesInElement(this.elementTarget, ElementTargetStylesIfTypeFixedDefault)
        }
    }

    private createTooltip() {
        const tooltipElement = document.createElement('div')

        tooltipElement.classList.add(this.getFullOptions().classTooltip)

        if (this.content instanceof HTMLElement) tooltipElement.appendChild(this.content)
        else tooltipElement.innerHTML = this.content

        this.elementTooltip = tooltipElement

        Tooltip.setStylesInElement(this.elementTooltip, TooltipStylesDefault)

        this.toggleTooltip(false)

        if (this.elementTarget) {
            this.elementTarget.appendChild(this.elementTooltip)
        }
    }

    private initEvents() {
        if (!this.elementTarget) { return }

        this.elementTarget.addEventListener('mouseenter', () => this.hoverInElement())
        this.elementTarget.addEventListener('mouseleave', () => this.houverOutElement())
        document.addEventListener('mousemove', (ev) => this.mouseMouseInElementTarget(ev))
    }

    private hoverInElement() {
        this.toggleTooltip(true)

        if (this.isTypeFloating()) { return }

        this.updatePositionTooltipIfFixed()
    }

    private houverOutElement() {
        this.toggleTooltip(false)
    }

    private mouseMouseInElementTarget(ev: MouseEvent) {
        if (!this.validFloatTooltip()) { return }

        const { x, y } = this.getNewPositionTooltipTypeFloating(ev)

        this.updatePositionTooltip(x, y)
    }

    private validFloatTooltip() {
        return this.state.isEnable && this.isTypeFloating()
    }

    private updatePositionTooltipIfFixed() {
        const newDirectionTooltip = this.getNewDirectionTooltipTypeFixed()

        const stylesByDirectionTooltip = TooltipStylesFixed[newDirectionTooltip]

        if (!stylesByDirectionTooltip) { return }

        Tooltip.setStylesInElement(this.elementTooltip, stylesByDirectionTooltip)

        this.updateTooltipClassDirection(newDirectionTooltip)
    }

    private updateTooltipClassDirection(newDirection: EnumTooltipDirections) {
        const newClassDirection = this.getFullOptions().classDirectionTooltip[newDirection]

        if (!newClassDirection) { return }

        for (const directionName in TooltipDirections) {
            const classDirection = this.getFullOptions().classDirectionTooltip[directionName as EnumTooltipDirections]

            if (!classDirection) { continue }

            this.elementTooltip.classList.remove(classDirection)
        }

        this.elementTooltip.classList.add(newClassDirection)
    }

    private updatePositionTooltip(x: number, y: number) {
        this.elementTooltip.style.top = `${x}px`
        this.elementTooltip.style.left = `${y}px`
    }

    private getNewPositionTooltipTypeFloating(ev: MouseEvent) {
        const { pageY, pageX } = ev

        return {
            x: pageY + this.getFullOptions().styles.gapMouseTooltipTypeFloatingInPx,
            y: pageX + this.getFullOptions().styles.gapMouseTooltipTypeFloatingInPx
        }
    }

    private getNewDirectionTooltipTypeFixed() {
        if (!this.elementTarget) {
            throw new Error('Element target tooltip not found')
        }

        const direction: EnumTooltipDirections = 'right'

        return direction
    }

    public toggleTooltip(forceState?: boolean) {
        this.toggleTooltipState(forceState)
        this.toggleTooltipClass()
        this.toggleTooltipStyles()
    }

    private toggleTooltipState(forceState?: boolean) {
        if (typeof forceState != 'undefined') this.state.isEnable = forceState
        else this.state.isEnable = !this.state.isEnable
    }

    private toggleTooltipClass() {
        this.elementTooltip.classList.toggle(this.getFullOptions().classEnable, this.state.isEnable)
        this.elementTooltip.classList.toggle(this.getFullOptions().classDisable, !this.state.isEnable)
    }

    private toggleTooltipStyles() {
        if (this.state.isEnable) this.showTooltipStyles()
        else this.hiddenTooltipStyles()
    }

    public showTooltipStyles() {
        Tooltip.setStylesInElement(this.elementTooltip, TooltipStylesEnable)
    }

    public hiddenTooltipStyles() {
        Tooltip.setStylesInElement(this.elementTooltip, TooltipStylesDisable)
    }

    private static setStylesInElement(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
        for (const styleName in styles) {
            // @ts-expect-error
            element.style[styleName] = styles[styleName]
        }
    }

    public isTypeFloating() {
        return this.getFullOptions().typePosition == 'float'
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
