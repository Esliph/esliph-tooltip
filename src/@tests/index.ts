import { TooltipEsliph } from '../lib/index.js'

function App() {
    const SELECTOR_ELEMENT_BUTTON = 'button[name="button"]'
    const TOOLTIP_CONTENT = 'Hello World'

    const tooltip = TooltipEsliph.newTooltip(SELECTOR_ELEMENT_BUTTON, TOOLTIP_CONTENT)

    tooltip.replaceTooltipElement(({ content }) => {
        return `<a>${content}</a>`
    })

    console.log(tooltip)
}

window.onload = App