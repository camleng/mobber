export const determineScreenSizeCategory = () => {
    return window.innerWidth >= 768 ? 'tablet' : 'phone';
};

let callbacks: ((category: string) => any)[] = [];

export const addWindowResizeCallback = (callback: (category: string) => any) => {
    callbacks.push(callback);
    window.addEventListener('resize', () => {
        const category = determineScreenSizeCategory();
        callbacks.forEach((cb) => cb(category));
    });
};
