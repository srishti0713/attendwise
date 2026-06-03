
export const toLocalISOString = (date = new Date()) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date - offset).toISOString();
};