export const addResizeListeners = (callback: () => void): void => {
    window.addEventListener('load', callback, false);
    window.addEventListener('resize', callback, false);
};
