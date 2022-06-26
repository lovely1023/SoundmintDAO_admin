import axios from "axios";

// Create an instance of axios
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});


// Add a request interceptor
api.interceptors.request.use(
  // Do something before request is sent
  config => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers["wallet-address"] = token;
      localStorage.setItem("token", token);
    } else {
      delete config.headers["wallet-address"];
      localStorage.removeItem("token");
    }

    return config;
  }, error => {
    Promise.reject(error)
  });

/*
  NOTE: intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
*/

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response.status === 401) {
//       store.dispatch({ type: LOGOUT });
//     }
//     return Promise.reject(err);
//   }
// );

export default api;
