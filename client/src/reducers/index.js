import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import auction from "./auction";

export default combineReducers({
  alert,
  auth,
  auction,
});
