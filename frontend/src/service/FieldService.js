import axios from "../api/axios";


const GET_ALL_FIELDS = "/get_all_fields"
const GET_FIELD = "/get_field"

export const getAllFieldsByDate = (data) => {
    return axios.get(GET_ALL_FIELDS, {
        params: {
            date: data
        }
    }).then(res => res.data);
}

export const getField = async (data) => {
    const response = await axios.get(GET_FIELD, {
        params: {
            field_auto: data.field_auto,
            date: data.date
        }
    });
    return response.data;
}