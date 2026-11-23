import k from '../kaplayCtx'
import { DEFAULT_FONT } from '../utils/fonts'
import { fadeAudioIn } from '../utils/audio'

export default function mainMenu() {
    // sfx
    const waterSfx = k.play('stormy-sea', {
        volume: 0,
        loop: true,
        speed: 0.7,
        detune: -50,
    })
    fadeAudioIn(waterSfx, 0.4, 0.5)

    // title
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

    // water shader bg
    k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.shader('water', () => ({
            u_time: k.time(),
            u_scale: 12.0,
            u_speed: 0.45,
            u_pixelSize: 2.0,
            u_resolution: k.vec2(k.width(), k.height()),
        })),
        k.z(-1),
    ])
}
