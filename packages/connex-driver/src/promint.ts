
/** class to make promise interruptable */
export class PromInt {
    private rejectors = new Set<(err: Error) => void>()

    /**
     * interrupt all wrapped promises
     */
    public interrupt(): void {
        const rejectors = this.rejectors
        this.rejectors = new Set()

        rejectors.forEach(r => r(new InterruptedError()))
    }

    /**
     * wrap the promise
     * @param p the given promise
     * @returns the wrapped promise which will raise InterruptedError on interruption
     */
    public wrap<T>(p: Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const rejectors = this.rejectors
            rejectors.add(reject)

            void p.then(resolve)
                .catch(reject)
                .then(() => rejectors.delete(reject))
        })
    }
}

export class InterruptedError extends Error {
    constructor() {
        super('promise interrupted')
    }
}

InterruptedError.prototype.name = 'InterruptedError'
