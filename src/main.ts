import k, { isDev } from './kaplayCtx'
import intro from './scenes/intro'
import mainMenu from './scenes/main-menu'
import loadWaterShader from './shaders/water'

if (isDev) {
    console.log('Starting in dev mode...')
}

// load fonts
k.loadFont('VT323', 'assets/fonts/VT323/VT323-Regular.ttf')

// load shader
loadWaterShader()

// load sounds
k.loadSound('stormy-sea', 'assets/sounds/stormy-sea.wav')

// load scenes
k.scene('main-menu', mainMenu)
k.scene('intro', intro)

// GOTO MENU
k.go('intro')
