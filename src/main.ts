import k, { isDev } from './kaplayCtx'

if (isDev) {
    console.log('Starting in dev mode...')
}

k.add([k.text('Hello World!')])
