import { useState } from 'react';

function useStorage (key: string, defaultValue: string): [string, (value: string) => void] {
    const getItem = () => {
        const val = localStorage.getItem(key);
        if (val === null) return defaultValue;
        return val;
    };

    const [value, setValue] = useState(getItem());

    const setItem = (newVal: string) => {
        setValue(newVal);
        localStorage.setItem(key, newVal);
    };

    return [value, setItem];
};

export default useStorage;

