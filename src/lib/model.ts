export type PartialObjet<Obj> = Obj extends object ? PartialObjet<Obj> : Partial<Obj>

export const TooltipTypePosition = {
    'float': 'float',
    'fixed': 'fixed',
} as const

export type EnumTooltipTypePosition = keyof typeof TooltipTypePosition

export const TooltipTypeEnable = {
    'hover': 'hover',
    'click': 'click',
} as const

export type EnumTooltipTypeEnable = keyof typeof TooltipTypeEnable

export type ElementTargetType = HTMLElement | null
export type ElementTooltipType = HTMLElement
export type ElementContentType = HTMLElement

export type TooltipStyles = Partial<CSSStyleDeclaration>
export const TooltipDirections = {
    'right': 'right',
    'left': 'left',
    'top': 'top',
    'bottom': 'bottom',
} as const

export type EnumTooltipDirections = keyof typeof TooltipDirections

export type TooltipOptions = {
    selectorElementTarget: string | HTMLElement | Element
    typePosition: EnumTooltipTypePosition
    typeEnable: EnumTooltipTypeEnable
    classEnable: string
    classDisable: string
    classPosition: string
    classPrefixPosition: string
    classTooltip: string
    classDirectionTooltip: { [x in EnumTooltipDirections]: string }
    styles: {
        gapMouseTooltipTypeFloatingInPx: number,
        gapBetweenElementTargetAndElementTooltipIfTypeFixed: { [x in EnumTooltipDirections]: number }
    }
}