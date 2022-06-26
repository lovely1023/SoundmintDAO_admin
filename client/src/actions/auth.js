import api from "../utils/api";
import { setAlert } from "./alert";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT
} from "./types";

export const login = (account, navigate) => async (dispatch) => {
  const body = { account };

  try {
    const res = await api.post("/auth", body);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token: res.data.token },
    });
    navigate("/");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    } else {
      dispatch(setAlert("Something Went Wrong, Please Try Again", "error"))
    }
    dispatch({ type: LOGIN_FAIL });
  }
};

export const logout = (navigate) => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT });
    navigate("/login");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    dispatch({ type: LOGIN_FAIL });
  }
};

export const register =
  (name, email, account, navigate) => async (dispatch) => {
    const body = { name, email, account };
    try {
      const res = await api.post("/users", body);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: { account: account, token: res.data.token },
      });
      navigate("/");
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
      }
      dispatch({ type: REGISTER_FAIL });
    }
  };
