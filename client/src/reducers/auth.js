import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  WALLET_CONNECT,
  WALLET_DISCONNECT,
  AUTH_ERROR,
  LOGOUT
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  account: null,
};

function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        token: null,
      };
    case WALLET_CONNECT:
      return {
        ...state,
        account: payload,
      };
    case WALLET_DISCONNECT:
      return {
        ...state,
        account: "",
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
      };
    case AUTH_ERROR:
    default:
      return state;
  }
}

export default authReducer;
