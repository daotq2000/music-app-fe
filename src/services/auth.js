import axios from 'axios';
import { API_ENDPOINT } from '../utils/Constaints';

export const loginAPI = async (data) => {
  return await axios.post(API_ENDPOINT + 'auth', data);
};
