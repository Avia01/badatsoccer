import axios from "axios";

export default axios.create({
    baseURL: 'https://goaltime.onrender.com',
    // baseURL: 'http://localhost:5000',
});
