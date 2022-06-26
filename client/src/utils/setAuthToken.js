import api from "./api";


// store our wallet-address in LS and set axios headers if we do have a token
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["wallet-address"] = token;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["wallet-address"];
    localStorage.removeItem("token");
  }
};

export default setAuthToken;
