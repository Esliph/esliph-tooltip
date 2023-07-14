import { Tooltip } from '../lib/index.js'

console.clear()

function App() {
    const SELECTOR_ELEMENT_BUTTON = 'button[name="button"]'
    const TOOLTIP_CONTENT = 'Hello World'

    const tooltip = Tooltip.create({
        content: TOOLTIP_CONTENT,
        options: {
            selectorElementTarget: SELECTOR_ELEMENT_BUTTON,
        }
    })

    console.log(tooltip)

    document.querySelector('button[name="button-active"]')?.addEventListener("click", () => {
        tooltip.setActive(!tooltip.isActive())
    })
}

window.onload = App