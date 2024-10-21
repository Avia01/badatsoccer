import axios from "../api/axios";

const LOGIN = '/login';

export const login = async (data) => {
    const response = await axios.post(LOGIN, data);
    return response.data;
}