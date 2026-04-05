import { api } from "./axios";

export const addSubject = async (formData, semesterId) => {
    const { data } = await api.post(`/subjects/${semesterId}`, formData);
    return data;
};

export const getSubjects = async (semesterId) => {
    const { data } = await api.get(`/subjects/${semesterId}`);
    return data;
};

export const getSubject = async (subjectId) => {
    const { data } = await api.get(`/subjects/${subjectId}`);
    return data;
};

export const updateSubject = async (subjectId, formData) => {
    const { data } = await api.patch(`/subjects/${subjectId}`, formData);
    return data;
};

export const deleteSubject = async (subjectId) => {
    const { data } = await api.delete(`/subjects/${subjectId}`);
    return data;
};
