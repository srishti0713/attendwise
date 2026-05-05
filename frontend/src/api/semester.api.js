import { api } from "./axios";

export const postSemester = async (payload) => {
    const { data } = await api.post("/semesters/create-semester", payload, {
        headers: { "Content-Type": "application/json" },
    });
    return data;
};

export const getSemester = async (semesterId) => {
    const { data } = await api.get(`/semesters/${semesterId}`);
    return data;
};

export const getSemesters = async () => {
    const { data } = await api.get(`/semesters/get-semesters`);
    return data;
};

export const editSemester = async (semesterId, payload) => {
    const { data } = await api.patch(`/semesters/${semesterId}`, payload, {
        headers: { "Content-Type": "application/json" },
    });
    return data;
};

export const deleteSemester = async (semesterId) => {
    const { data } = await api.delete(`/semesters/${semesterId}`);
    return data;
};

export const getCurrentSemester = async () => {
    const { data } = await api.get(`/semesters/current`);
    return data;
};
