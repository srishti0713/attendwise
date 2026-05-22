import { api } from "./axios";

export const addAssignment = async ({
    subjectId,
    title,
    description,
    dueDate,
}) => {
    const { data } = await api.post(
        `/assignments/create-assignment/${subjectId}`,
        payload,
        {
            headers: { "Content-Type": "application/json" },
        },
    );
    return data;
};

export const getAssignment = async (assignmentId) => {
    const { data } = await api.get(
        `/assignments/get-assignment/${assignmentId}`,
    );
    return data;
};

export const getSubjectAssignments = async (subjectId) => {
    const { data } = await api.get(
        `/assignments/get-subjectAssignments/${subjectId}`,
    );
    return data;
};

export const getCompletedAssignments = async (subjectId) => {
    const { data } = await api.get(
        `/assignments/get-completedAssignments/${subjectId}`,
    );
    return data;
};

export const getSemesterAssignments = async (semesterId) => {
    const { data } = await api.get(
        `/assignments/get-semesterAssignments/${semesterId}`,
    );
    return data;
};

export const editAssignment = async ({ assignmentId, ...fields }) => {
    const { data } = await api.patch(
        `/assignments/edit-assignment/${assignmentId}`,
        fields,
        {
            headers: { "Content-Type": "application/json" },
        },
    );
    return data;
};

export const deleteAssignment = async (assignmentId) => {
    const { data } = await api.delete(
        `/assignments/delete-assignment/${assignmentId}`,
    );
    return data;
};
