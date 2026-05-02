import {api} from './axios'

export const updateProfile = async(FormData) =>{
    const { data } = await api.post("/user/update", FormData);
    return data;
}
export const deleteUser = async() => {
    const { data } = await api.delete("/user/");
    return data;
}
