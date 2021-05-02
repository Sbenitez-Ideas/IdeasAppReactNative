import axios from 'axios';
import { API_URL } from 'react-native-dotenv';

const baseURL =  API_URL;


const authApi = axios.create({ baseURL });


export default authApi;