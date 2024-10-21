import axios from "../api/axios";

const GET_LOG = '/log';
const POST_CLEAR_LOG = '/logs/clear'

export const getSheetLog = async () => {
    return await axios.get(GET_LOG)
}
export const clearLog = async () => {
    return await axios.post(POST_CLEAR_LOG)
}