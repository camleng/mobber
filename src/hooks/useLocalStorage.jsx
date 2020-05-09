import { useState } from "react";

const useLocalStorage = (key, defaultValue) => {
    const getItem = () => {
        const val = localStorage.getItem(key);
        if (val === null) return defaultValue;
        return JSON.parse(val);
    };

    const [value, setValue] = useState(getItem());

    const setItem = (newVal) => {
        setValue(newVal);
        localStorage.setItem(key, JSON.stringify(newVal));
    };

    return [value, setItem];
};

export default useLocalStorage;
