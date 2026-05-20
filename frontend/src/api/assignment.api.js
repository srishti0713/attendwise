import { api } from "./axios";

export const addAssignment = async ({
    subjectId,
    title,
    description,
    dueDate,
}) => {
    const { data } = await api.post(
        `/add-assignment/${subjectId}`,
        { title, description, dueDate },
        { withCredentials: true },
    );
    return data;
};

export const getAssignment = async (assignmentId) => {
    const { data } = await api.get(`/get-assignment/${assignmentId}`, {
        withCredentials: true,
    });
    return data;
};

export const getSubjectAssignments = async (subjectId) => {
    const { data } = await api.get(`/get-subjectAssignments/${subjectId}`, {
        withCredentials: true,
    });
    return data;
};

export const getCompletedAssignments = async (subjectId) => {
    const { data } = await api.get(`/get-completedAssignments/${subjectId}`, {
        withCredentials: true,
    });
    return data;
};

export const getSemesterAssignments = async (semesterId) => {
    const { data } = await api.get(
        `${BASE_URL}/get-semesterAssignments/${semesterId}`,
        { withCredentials: true },
    );
    return data;
};

// ─── Edit an assignment (title, description, dueDate, status) ─────────────────
export const editAssignment = async ({ assignmentId, ...fields }) => {
    const { data } = await axios.patch(
        `${BASE_URL}/edit-assignment/${assignmentId}`,
        fields,
        { withCredentials: true },
    );
    return data;
};

// ─── Delete an assignment ─────────────────────────────────────────────────────
export const deleteAssignment = async (assignmentId) => {
    const { data } = await axios.delete(
        `${BASE_URL}/delete-assignment/${assignmentId}`,
        { withCredentials: true },
    );
    return data;
};
