import { Tooltip } from '../lib/index.js'

console.clear()

function App() {
    const SELECTOR_ELEMENT_BUTTON = 'button[name="button"]'
    const TOOLTIP_CONTENT = 'Hello World'

    const tooltip = Tooltip.create({
        content: 'Hello World',
        options: {
            selectorElementTarget: 'button[name="button"]'
        }
    })

    console.log(tooltip)
}

window.onload = App