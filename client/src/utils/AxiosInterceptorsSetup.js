
import { LOGOUT } from "../actions/types";
import store from "../store";
import api from "./api";

const AxiosInterceptorsSetup = navigate => {
    api.interceptors.response.use(
        response => response,
        error => {
            if (error.response.status === 401) {
                store.dispatch({ type: LOGOUT });
                navigate('/login');
            } else if (error.response.status === 500) {
                store.dispatch({ type: LOGOUT });
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );
};

export default AxiosInterceptorsSetup;