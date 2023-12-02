import axios from "axios";
import { SERVER_URL } from './common/config'
/*
export default axios.create({
  baseURL: 'http://185.151.51.169:4000',
  headers: {
    "Content-Type": "application/json"
  }
});*/

export default axios.create({
   baseURL: SERVER_URL,
   headers: {
     "Content-Type": "application/json"
   }
});