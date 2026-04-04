import { api } from "./axios";

export const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    return data;
};

export const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    return data;
};

export const logout = async () => {
    const { data } = await api.post("/auth/logout");
    return data;
};

export const getCurrentUser = async () => {
    const { data } = await api.get("/auth/me");
    return data;
};
