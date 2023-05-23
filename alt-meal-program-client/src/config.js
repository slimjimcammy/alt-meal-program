import Axios from "axios";

const axiosInstance = Axios.create({
    baseURL: "https://alternativemealprogram.herokuapp.com"
});

export default axiosInstance;