export type PartialObjet<Obj> = Obj extends object
    ? { [PropName in keyof Obj]?: Obj[PropName] extends object ? PartialObjet<Obj[PropName]> : Obj[PropName] }
    : Obj

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
    'top': 'top',
    'left': 'left',
    'bottom': 'bottom',
} as const

export type EnumTooltipDirections = keyof typeof TooltipDirections

export type TooltipOptions = {
    selectorElementTarget: string | HTMLElement | Element
    typePosition: EnumTooltipTypePosition
    typeEnable: EnumTooltipTypeEnable
    fixedPosition: EnumTooltipDirections | null
    defaultPosition: EnumTooltipDirections
    classEnable: string
    classDisable: string
    classPosition: string
    classPrefixPosition: string
    classTooltip: string
    classDirectionTooltip: { [x in EnumTooltipDirections]: string }
    delay: number
    styles: {
        gapMouseTooltipTypeFloatingInPx: number
    }
}

export type DirectionFunctionValidArgs = {
    positionElementTarget: { x: number, y: number },
    widthElementTarget: number,
    heightElementTarget: number,
    widthElementTooltip: number,
    heightElementTooltip: number,
    widthWindow: number,
    heightWindow: number
}