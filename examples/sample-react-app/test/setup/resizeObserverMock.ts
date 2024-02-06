class ResizeObserverMock {
    private readonly callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }

    observe() {
        // Mock observe method
    }

    unobserve() {
        // Mock unobserve method
    }

    disconnect() {
        // Mock disconnect method
    }
}

// Make the mock globally available
global.ResizeObserver = ResizeObserverMock;
