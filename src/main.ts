import k, { isDev } from './kaplayCtx'
import { DEFAULT_FONT } from './utils'

if (isDev) {
    console.log('Starting in dev mode...')
}

// load fonts
k.loadFont('VT323', 'assets/fonts/VT323-Regular.ttf')

k.add([
    k.text('BATTLESHIP', {
        font: DEFAULT_FONT,
        size: 128,
        transform: (idx: number) => ({
            pos: k.vec2(0, Math.sin(k.time() * 4 + idx * 0.5)),
            angle: Math.cos(k.time() * 4 + idx * 0.5),
        }),
    }),
    k.pos(k.center().x, 150),
    k.anchor('center'),
])
