import axios from "axios";

export default axios.create({
    baseURL: 'https://python-flask-webapp-t.azurewebsites.net',
    // baseURL: 'http://localhost:5000',
});
