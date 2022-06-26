import { Navigate } from "react-router-dom";
const PrivateRoute = ({ children }) => {
  const loggedIn = localStorage.getItem("token");
  return loggedIn ? children : <Navigate to="/login" />;
};
export default PrivateRoute;
