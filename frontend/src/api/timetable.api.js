import { api } from "./axios";

export const postTimetable = async (semesterId, timetable) => {
    const { data } = await api.post(`/timetable/${semesterId}`, { timetable });
    return data;
};

export const getTimetable = async (semesterId) => {
    const { data } = await api.get(`/timetable/${semesterId}`);
    return data;
};

export const editTimetable = async (semesterId, day, subjects) => {
    const { data } = await api.patch(`/timetable/${semesterId}`, {
        day,
        subjects,
    });
    return data;
};
