// maps src to library promise
const cache: Record<string, Promise<unknown>> = {}

export function loadLibrary<T>(src: string, libName: string): Promise<T> {
    let lib = cache[src] as Promise<T> | undefined
    if (!lib) {
        const script = document.createElement('script')
        cache[src] = lib = new Promise((resolve, reject) => {
            script.onload = () => resolve((window as never)[libName])
            script.onerror = err => reject(new Error(err.toString()))
        })
        script.src = src
        document.body.appendChild(script)
    }
    return lib
}
