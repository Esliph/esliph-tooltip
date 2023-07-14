import { EnumTooltipDirections, TooltipOptions, TooltipStyles } from './model.js'

export const DEFAULT_TOOLTIP_OPTIONS: TooltipOptions = {
    typeEnable: 'hover',
    typePosition: 'fixed',
    classEnable: 'tooltip-enable',
    classDisable: 'tooltip-disable',
    classPrefixPosition: 'tooltip-position',
    classTooltip: 'tooltip',
    classPosition: '',
    selectorElementTarget: '',
    classDirectionTooltip: {
        bottom: 'tooltip-bottom',
        left: 'tooltip-left',
        right: 'tooltip-right',
        top: 'tooltip-top'
    },
    styles: {
        gapMouseTooltipTypeFloatingInPx: 15,
        gapBetweenElementTargetAndElementTooltipIfTypeFixed: {
            bottom: 15,
            left: 15,
            right: 15,
            top: 15
        }
    }
}

export const ElementTargetStylesDefault: TooltipStyles = {}
export const ElementTargetStylesIfTypeFixedDefault: TooltipStyles = {
    position: 'relative',
}
export const TooltipStylesDefault: TooltipStyles = {
    position: 'absolute',
    zIndex: '1000',
}
export const TooltipStylesDisable: TooltipStyles = {
    display: 'none',
}
export const TooltipStylesEnable: TooltipStyles = {
    display: 'block',
}
export const TooltipStylesFixed: { [x in EnumTooltipDirections]: TooltipStyles } = {
    bottom: {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)'
    },
    left: {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)'
    },
    right: {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)'
    },
    top: {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)'
    }
}