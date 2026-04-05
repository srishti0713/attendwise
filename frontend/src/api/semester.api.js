import { api } from "./axios";

export const postSemester = async (FormData) => {
    const { data } = await api.post("/semesters/create-semester", FormData);
    return data;
}

export const getSemester = async (semesterId) =>  {
    const { data } = await api.get(`/semesters/${semesterId}`);
    return data;
} 

export const getSemesters = async ()=>{
    const { data } = await api.get(`/semesters/get-semesters`);
    return data;
} 

export const editSemester = async (semesterId, FormData) => {
    const { data } = await api.patch(`/semesters/${semesterId}`, FormData);
    return data;
}

export const deleteSemester = async (semesterId) => {
    const { data } = await api.delete(`/semesters/${semesterId}`);
    return data;
}