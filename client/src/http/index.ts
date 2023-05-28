import axios from "axios";


const $host = axios.create({
    baseURL: process.env.REACT_APP_FACE_API_URL
})

export {
    $host,
}
