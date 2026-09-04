import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://online-coding-platform-2.onrender.com",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosClient;



