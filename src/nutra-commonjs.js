import ReallyNeed from 'really-need'
require = ReallyNeed

const moduleloader = (events, system, opts) => {
    events.onLoad = () => {
        system.files.forEach(function (file) {
            require(file, {
                bust: true,
                pre: system.callbacks.onFileSourceLoaded
            })
        })
    }
    events.onExit = () => {}
}

export { moduleloader }
