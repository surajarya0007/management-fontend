export const getLocalStorgeToken = (): string | null => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
};