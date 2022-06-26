import api from "../utils/api";
import { AUCTION_LOADED } from "./types";
import { setAlert } from "./alert";

export const loadAuction = () => async (dispatch) => {
  try {
    const res = await api.get("/auctions");
    dispatch({ type: AUCTION_LOADED, payload: res.data });
  } catch (err) {
    const error = err?.response?.data?.msg;
    if (error) {
      dispatch(setAlert(error, "error"));
    } else {
      dispatch(setAlert('Something went wrong, please try again', "error"));
    }
    dispatch({ type: AUCTION_LOADED, payload: [] });
  }
};

export const addAuction =
  (title, desc, start, end, price, metadata, mintText) => async (dispatch) => {
    const body = { title, desc, start, end, price, metadata, mintText };

    try {
      const res = await api.post("/auctions", body);
      dispatch(loadAuction());
      dispatch(setAlert(res.data, "success"));
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
      }
    }
  };

export const updateAuction =
  (title, desc, start, end, price, metadata, mintText, _id) => async (dispatch) => {
    const body = { title, desc, start, end, price, metadata, mintText, _id };

    try {
      const res = await api.post("/auctions/update", body);
      dispatch(loadAuction());
      dispatch(setAlert(res.data, "success"));
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
      }
    }
  };

export const updateMintVisibility =
  ({ _id, isMintVisible }) => async (dispatch) => {
    const body = { _id, isMintVisible };

    try {
      const res = await api.put("/auctions/updateMintVisibility", body);
      dispatch(loadAuction());
      dispatch(setAlert(res.data, "success"));
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
      }
    }
  };


export const deleteAuction =
  (_id) => async (dispatch) => {
    const body = { _id };
    try {
      const res = await api.post("/auctions/delete", body);
      dispatch(loadAuction());
      dispatch(setAlert(res.data, "success"));
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
      }
    }
  };

