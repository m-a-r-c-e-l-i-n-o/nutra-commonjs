import Fs from 'fs'
import requireHacker from 'require-hacker'

const moduleloader = (events, system, opts) => {
    const cache = {}
    events.onLoad = () => {
        const hook = requireHacker.hook('js', (filename) => {
            if (cache[filename]) {
                return cache[filename]
            }
            return cache[filename] = system.callbacks.onFileSourceLoaded(
                Fs.readFileSync(filename, 'utf8'),
                filename
            )
        })
        system.files.forEach((file) => require(file))
        hook.unmount()
    }
    events.onExit = () => {}
}

export { moduleloader }
