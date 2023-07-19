import {
    DirectionFunctionValidArgs,
    ElementContentType,
    ElementTargetType,
    ElementTooltipType,
    EnumTooltipDirections,
    PartialObjet,
    TooltipDirections,
    TooltipOptions,
} from './model.js'
import {
    DEFAULT_TOOLTIP_OPTIONS,
    ElementTargetStylesDefault,
    ElementTargetStylesIfTypeFixedDefault,
    TooltipStylesDefault,
    TooltipStylesDisable,
    TooltipStylesEnable,
    TooltipStylesFixed,
} from './global.js'
import { ObserverTooltip } from './observer.js'

export class Tooltip extends ObserverTooltip {
    private elementTarget: ElementTargetType
    private elementTooltip: ElementTooltipType
    private options: TooltipOptions
    private content: ElementContentType
    private state: { active: boolean; enable: boolean; inDelay: boolean }

    private constructor(elementTarget: ElementTargetType, content: ElementContentType, options?: PartialObjet<TooltipOptions>) {
        super()
        this.elementTarget = elementTarget
        // @ts-expect-error
        this.elementTooltip = null
        this.content = content
        // @ts-expect-error
        this.options = Tooltip.mergeOptions(options)
        this.state = {
            active: true,
            enable: false,
            inDelay: false,
        }
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
        this.setupElementTarget()
        this.createTooltip()
        this.initEvents()
    }

    private setupElementTarget() {
        if (!this.elementTarget) {
            return
        }

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
        if (!this.elementTarget) {
            return
        }

        if (this.options.typeEnable == 'hover') {
            this.initEventsTooltipTypeHover()
        } else {
            this.initEventsTooltipTypeClick()
        }
    }

    private initEventsTooltipTypeHover() {
        if (!this.elementTarget) {
            return
        }

        this.elementTarget.addEventListener('mouseenter', () => this.clickOrHoverInElement())
        this.elementTarget.addEventListener('mouseleave', () => this.houverOutElement())
        document.addEventListener('mousemove', ev => this.mouseMouseInElementTarget(ev))
    }

    private initEventsTooltipTypeClick() {
        if (!this.elementTarget) {
            return
        }

        this.elementTarget.addEventListener('mousedown', () => this.clickOrHoverInElement())
        this.elementTarget.addEventListener('mouseleave', () => this.houverOutElement())
        document.addEventListener('mousemove', ev => this.mouseMouseInElementTarget(ev))
    }

    private clickOrHoverInElement() {
        this.performActiveTooltip()
    }

    private performActiveTooltip() {
        this.state.inDelay = true
        setTimeout(() => {
            if (!this.state.inDelay) {
                return
            }

            if (!this.state.active) {
                return
            }

            this.toggleTooltip(true)

            if (this.isTypeFloating()) {
                return
            }

            this.updatePositionTooltipIfFixed()
        }, this.getFullOptions().delay)
    }

    private houverOutElement() {
        this.state.inDelay = false
        this.toggleTooltip(false)
        this.removeTooltipClassDirection()
    }

    private mouseMouseInElementTarget(ev: MouseEvent) {
        if (!this.validFloatTooltip()) {
            return
        }

        const { x, y } = this.getNewPositionTooltipTypeFloating(ev)

        this.updatePositionTooltip(x, y)
    }

    private validFloatTooltip() {
        return this.state.enable && this.isTypeFloating()
    }

    private updatePositionTooltipIfFixed() {
        const newDirectionTooltip = this.getNewDirectionTooltipTypeFixed()

        const stylesByDirectionTooltip = TooltipStylesFixed[newDirectionTooltip]

        if (!stylesByDirectionTooltip) {
            return
        }

        Tooltip.setStylesInElement(this.elementTooltip, stylesByDirectionTooltip)

        this.updateTooltipClassDirection(newDirectionTooltip)
    }

    private removeTooltipClassDirection() {
        for (const directionName in TooltipDirections) {
            const classDirection = this.getFullOptions().classDirectionTooltip[directionName as EnumTooltipDirections]

            if (!classDirection) {
                continue
            }

            this.elementTooltip.classList.remove(classDirection)
        }
    }

    private updateTooltipClassDirection(newDirection: EnumTooltipDirections) {
        const newClassDirection = this.getFullOptions().classDirectionTooltip[newDirection]

        this.removeTooltipClassDirection()

        if (!newClassDirection) {
            return
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
            y: pageX + this.getFullOptions().styles.gapMouseTooltipTypeFloatingInPx,
        }
    }

    private getNewDirectionTooltipTypeFixed() {
        if (!this.elementTarget) {
            throw new Error('Element target tooltip not found')
        }

        if (this.getFullOptions().fixedPosition) {
            return this.getFullOptions().fixedPosition as EnumTooltipDirections
        }

        const DIRECTION_FUNCTIONS_VALID: { [x in EnumTooltipDirections]: (args: DirectionFunctionValidArgs) => boolean } = {
            bottom: this.validDirectionButton,
            left: this.validDirectionLeft,
            right: this.validDirectionRight,
            top: this.validDirectionTop,
        }

        const positionElementTarget = Tooltip.getPositionElementInWindow(this.elementTarget)
        const widthElementTarget = this.elementTarget.clientWidth
        const heightElementTarget = this.elementTarget.clientHeight
        const widthElementTooltip = this.elementTooltip.clientWidth
        const heightElementTooltip = this.elementTooltip.clientHeight
        const widthWindow = window.innerWidth
        const heightWindow = window.innerHeight

        const directionDefault: EnumTooltipDirections = this.getFullOptions().defaultPosition

        let directionsValid: EnumTooltipDirections[] = []

        for (const directionName in TooltipDirections) {
            if (!DIRECTION_FUNCTIONS_VALID[directionName as EnumTooltipDirections]) {
                continue
            }

            if (
                !DIRECTION_FUNCTIONS_VALID[directionName as EnumTooltipDirections]({
                    heightElementTarget,
                    heightElementTooltip,
                    heightWindow,
                    positionElementTarget,
                    widthElementTarget,
                    widthElementTooltip,
                    widthWindow,
                })
            ) {
                continue
            }

            directionsValid.push(directionName as EnumTooltipDirections)
        }

        if (directionsValid.length == 0) {
            return directionDefault
        }

        if (directionsValid.length > 1) {
            if (directionsValid.find(dir => dir == directionDefault)) {
                return directionDefault
            }
        }

        return directionsValid[0]
    }

    private validDirectionRight({ widthWindow, positionElementTarget, widthElementTarget, widthElementTooltip }: DirectionFunctionValidArgs) {
        return positionElementTarget.x + widthElementTarget + widthElementTooltip < widthWindow
    }

    private validDirectionLeft({ positionElementTarget, widthElementTooltip }: DirectionFunctionValidArgs) {
        return positionElementTarget.x - widthElementTooltip > 0
    }

    private validDirectionTop({ positionElementTarget, heightElementTooltip }: DirectionFunctionValidArgs) {
        return positionElementTarget.y - heightElementTooltip > 0
    }

    private validDirectionButton({ positionElementTarget, heightWindow, heightElementTarget, heightElementTooltip }: DirectionFunctionValidArgs) {
        return positionElementTarget.y + heightElementTarget + heightElementTooltip < heightWindow
    }

    private static getPositionElementInWindow(element: HTMLElement) {
        let position = { x: 0, y: 0 }

        while (element) {
            position.x += element.offsetLeft - element.scrollLeft + element.clientLeft
            position.y += element.offsetTop - element.scrollTop + element.clientTop
            // @ts-expect-error
            element = element.offsetParent
        }

        return position
    }

    public toggleTooltip(forceState?: boolean) {
        this.toggleTooltipState(forceState)
        this.toggleTooltipClass()
        this.toggleTooltipStyles()
    }

    private toggleTooltipState(forceState?: boolean) {
        if (typeof forceState != 'undefined') this.state.enable = forceState
        else this.state.enable = !this.state.enable
    }

    private toggleTooltipClass() {
        this.elementTooltip.classList.toggle(this.getFullOptions().classEnable, this.state.enable)
        this.elementTooltip.classList.toggle(this.getFullOptions().classDisable, !this.state.enable)
    }

    private toggleTooltipStyles() {
        if (this.state.enable) this.showTooltipStyles()
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

    private removeElementTooltip() {
        this.elementTooltip.remove()
        // @ts-expect-error
        this.elementTooltip = null
    }

    public isTypeFloating() {
        return this.getFullOptions().typePosition == 'float'
    }

    private getFullOptions() {
        return { ...Tooltip.getDefaultOptions(), ...this.options }
    }

    public setActive(value: boolean) {
        this.state.active = value
    }

    public isActive() {
        return this.state.active
    }

    public getOptions() {
        return { ...this.options }
    }

    public updateOptions(options: PartialObjet<TooltipOptions>) {
        this.setOptions({ ...this.getFullOptions(), ...options } as TooltipOptions)
        this.removeElementTooltip()
        this.initComponents()
    }

    private setOptions(options: TooltipOptions) {
        this.options = options
    }

    public getElementTarget() {
        return { ...this.elementTarget }
    }

    public getElementTooltip() {
        return { ...this.elementTooltip }
    }
}
