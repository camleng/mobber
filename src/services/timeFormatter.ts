const formatTime = (seconds: number) => {
    if (seconds === undefined || seconds === null) return "00:00";
    const min = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
};

export { formatTime };
