import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from "./privateRoute";
import AlertBox from "./components/layout/AlertBox";
import Header from "./components/layout/Header";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Box from '@mui/material/Box';

import metamask_connect from "./utils/metamask_connect";

import "./App.css";

import Timer from "./components/timer/Timer";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInterceptorsSetup from "./utils/AxiosInterceptorsSetup";
import Mintlist from "./pages/Mintlist";
import ManageAuction from "./pages/ManageAuction";
import ManageLiveMint from "./pages/ManageLiveMint";
import ManageStem from "./pages/ManageStem";
import MemberEmails from "./pages/MemberEmails";

function AxiosInterceptorNavigate() {
  let navigate = useNavigate();
  AxiosInterceptorsSetup(navigate);
  return <></>;
}

function App() {
  useEffect(() => {
    metamask_connect();
  }, []);
  return (
    <Box sx={{ pt: 5, pl: 4, pr: 4 }}>
      <Provider store={store}>
        <AlertBox />
        <BrowserRouter>
          <AxiosInterceptorNavigate />
          <Header />
          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                {/* <ManageAuction /> */}
                <ManageLiveMint />
              </PrivateRoute>
            } />
            {/* <Route path="/livemint" element={
              <PrivateRoute>
                <ManageLiveMint />
              </PrivateRoute>
            } /> */}
            <Route path="/stem" element={
              <PrivateRoute>
                <ManageStem />
              </PrivateRoute>
            } />
            <Route path="/timer" element={
              <PrivateRoute>
                <Timer />
              </PrivateRoute>
            } />
            <Route path="/mintlist" element={
              <PrivateRoute>
                <Mintlist />
              </PrivateRoute>
            } />
            <Route path="/1of1s" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/member-emails" element={
              <PrivateRoute>
                <MemberEmails />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </Provider>
      <ToastContainer />
    </Box>
  );
}

export default App;
