export const determineScreenSizeCategory = () => {
    return window.innerWidth >= 768 ? 'tablet' : 'phone';
};

let callbacks = [];

export const addResizeCallback = (callback) => {
    callbacks.push(callback);
    window.addEventListener('resize', () => {
        const category = determineScreenSizeCategory();
        callbacks.forEach((cb) => cb(category));
    });
};
