import axios from "../api/axios";

const LOGIN = '/login';

export const login = async (data) => {
    const response = await axios.post(LOGIN, data, {
        headers: {
            'Authorization': `Bearer ${data}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}