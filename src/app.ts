import { RoonService } from './services/RoonService'

async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

(async () => {
    const r = RoonService.getInstance()
    await delay(5000)
    r.setStatus('ready')
    r.controlMusic('playpause')
    await delay(2000)
    r.muteMusic()
    await delay(2000)
    r.unmuteMusic()
    await delay(2000)
    r.controlMusic('playpause')
})()