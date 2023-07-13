import { TolltipOptions } from './model.js'

export const DEFAULT_TOOLTIP_OPTIONS: TolltipOptions = {
    typeEnable: 'hover',
    typePosition: 'fixed',
    classEnable: 'tooltip-enable',
    classDisable: 'tooltip-disable',
    classPrefixPosition: 'tooltip-position',
    classTooltip: 'tooltip',
    classPosition: '',
    selectorElementTarget: '',
}

export type TooltipStyles = Partial<CSSStyleDeclaration>

export const TooltipStylesDefault: TooltipStyles = {
    position: 'absolute',
}
export const TooltipStylesDisable: TooltipStyles = {
    display: 'none',
    opacity: '0',
}
export const TooltipStylesEnable: TooltipStyles = {
    display: 'block',
    opacity: '1',
}
