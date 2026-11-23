import type { AreaComp } from 'kaplay'
import k from '../kaplayCtx'
import { DEFAULT_FONT } from '../utils/fonts'
import { isDev } from '../kaplayCtx'

// NOTE: line arg is 0 indexed
function createTextObject(
    text: string,
    line: number,
    font: string = DEFAULT_FONT
) {
    return k.add([
        k.text(text, {
            font,
        }),
        k.pos(0, k.height() * 0.05 * line),
    ])
}

export default function intro() {
    k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0), 'canvas', k.z(-1)])

    const repoLink = 'https://github.com/zachaa2/battleship'

    createTextObject('This is a free game made by Aaron Zachariah.', 0)
    createTextObject(
        'The code is made available under the MIT License, and original assets under CC0 1.0.',
        1
    )
    createTextObject('All third party assets retain their licenses.', 2)
    createTextObject(
        'Source code can be found at the repository link below.',
        3
    )
    const link = createTextObject(repoLink, 4)
    link.use(k.area())
    // TS infers the type from k.add(), but the link gains the area comp so it's clickable
    const clickableLink = link as typeof link & AreaComp

    k.add([
        k.text('Click Any Key to Proceed', {
            font: DEFAULT_FONT,
            size: 64,
        }),
        k.anchor('center'),
        k.pos(k.center()),
    ])

    k.onKeyPress((key) => {
        if (!isDev || key !== 'd') k.go('main-menu')
    })
    k.onMousePress(() => {
        if (clickableLink.isHovering()) {
            window.open(repoLink, '_blank')
        } else {
            k.go('main-menu')
        }
    })
}
