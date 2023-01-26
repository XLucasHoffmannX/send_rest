import axios from 'axios';
import Cookies from 'js-cookie';

export const Http = axios.create({
    baseURL: process.env.REACT_APP_URL_ROOT,
});

/* response */
/* Http.interceptors.response.use(res => { return res }, error => {
    if (error.response) {
        const logged = localStorage.getItem('primaryLogin') === 'true';

        if (error.response.status === 500 && logged) {
            localStorage.removeItem('primaryLogin');
            Cookies.remove('access-token', { path: "/", domain: "localhost" });

            return error;
        }
        return error.data;
    }
}) */

export const HttpAuth = axios.create({
    baseURL: process.env.REACT_APP_URL_ROOT
})

/* request */
HttpAuth.interceptors.request.use(
    async (config: any) => {
        config.headers.authorization = `${Cookies.get('access-token')}`;

        return config;
    }
);

/* response */
HttpAuth.interceptors.response.use(res => { return res }, error => {
    if (error.response) {
        console.log(error);
        if (error.response.status === 401 || error.response.status === 500) {
            localStorage.removeItem('primaryLogin');
            Cookies.remove('access-token', { path: "/", domain: "localhost" });

            window.location.replace('/');
        }
    }
})