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

export type TolltipOptions = {
    selectorElementTarget: string | HTMLElement | Element
    typePosition: EnumTooltipTypePosition
    typeEnable: EnumTooltipTypeEnable
    classEnable: string
    classDisable: string
    classPosition: string
    classPrefixPosition: string
    classTooltip: string
}

export type ElementTargetType = HTMLElement | null
export type ElementTooltipType = HTMLElement
export type ElementContentType = HTMLElement
