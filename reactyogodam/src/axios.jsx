// 8-1 axios 설정
import axios from 'axios';

const instance = axios.create({
    baseURL : 'http://localhost:8000'
})

export default instance;