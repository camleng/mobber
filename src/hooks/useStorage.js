import { useState } from 'react';

const useStorage = (key, defaultValue) => {
    const getItem = () => {
        const val = localStorage.getItem(key);
        if (val === null) return defaultValue;
        return val;
    };

    const [value, setValue] = useState(getItem());

    const setItem = (newVal) => {
        setValue(newVal);
        localStorage.setItem(key, newVal);
    };

    return [value, setItem];
};

export default useStorage;
