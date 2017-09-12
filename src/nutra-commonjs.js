import { join } from 'path'
import { readFileSync } from 'fs'
import requireHacker from 'require-hacker'

const moduleloader = (events, system, opts) => {
    const cache = {}
    events.onLoad = () => {
        const hook = requireHacker.global_hook('*', (filename, module) => {
            if (!filename.endsWith('.js')) return

            const { tmpDirectory: tmp } = system
            const { filename: name } = module
            if (name.indexOf(tmp) === 0) {
                const pluginName = name.slice(tmp.length + 1)
                const baseName = pluginName
                    .slice(pluginName.indexOf('/'))
                    .replace(/\|/g, '/')
                    .slice(0, -2)

                module.filename = join(system.basePath, baseName)
            }

            const resolvedName = requireHacker.resolve(filename, module)
            if (cache[resolvedName]) {
                return cache[resolvedName]
            }
            return cache[resolvedName] = system.callbacks.onFileSourceLoaded(
                readFileSync(resolvedName, 'utf8'),
                resolvedName
            )
        })
        system.files.forEach((file) => require(file))
        hook.unmount()
    }
    events.onExit = () => {}
}

export { moduleloader }
