import axios from "axios";
import { SERVER_URL } from "../../common/config";

export const loginApi = (user) => {
    // axios.defaults.baseURL = 'https://api.example.com';
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

    // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    let headers = {
        'Accept': 'application/json',
        "Content-Type": "application/json",
    }
    return new Promise((resolve, reject) => {
        axios.post(`${SERVER_URL}login`, user, {
            headers: headers,
        }).then(res => {
            console.log("login response ===> ", res);
            resolve(res);
        })
            .catch(err => {
                reject(err);
            })
    })
}

export const signUpApi = (user) => {
    // axios.defaults.baseURL = 'https://api.example.com';
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

    // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    let headers = {
        'Accept': 'application/json',
        "Content-Type": "application/json",
    }
    return new Promise((resolve, reject) => {
        axios.post(`${SERVER_URL}signup`, user, {
            headers: headers,
        }).then(res => {
            resolve(res);
        })
            .catch(err => {
                reject(err);
            })
    })
}