import { api } from "./axios";

export const addSubject = async (payload, semesterId) => {
    const { data } = await api.post(`/subjects/${semesterId}`, payload, {
        headers: { "Content-Type": "application/json" },
    });
    return data;
};

export const getSubjects = async (semesterId) => {
    const { data } = await api.get(`/subjects/${semesterId}`);
    return data;
};

export const getSubject = async (subjectId) => {
    const { data } = await api.get(`/subjects/get-subject/${subjectId}`);
    return data;
};

export const updateSubject = async (subjectId, payload) => {
        const { data } = await api.patch(`/subjects/${subjectId}`, payload, {
            headers: { "Content-Type": "application/json" },
        });
        return data;
};

export const deleteSubject = async (subjectId) => {
    const { data } = await api.delete(`/subjects/${subjectId}`);
    return data;
};
