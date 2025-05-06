import { describe, expect, it, vi } from 'vitest';
import { addResizeListeners } from '../../src/utils/listeners';

describe('addResizeListeners', () => {
    it('should call the callback when the window loads', () => {
        const callback = vi.fn();
        addResizeListeners(callback);

        // Simulate a 'load' event on the window
        window.dispatchEvent(new Event('load'));

        expect(callback).toHaveBeenCalled();
    });

    it('should call the callback when the window resizes', () => {
        const callback = vi.fn();
        addResizeListeners(callback);

        // Simulate a 'resize' event on the window
        window.dispatchEvent(new Event('resize'));

        expect(callback).toHaveBeenCalled();
    });
});
