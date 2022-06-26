import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Box, Button } from "@mui/material";

import metamask_connect from "../../utils/metamask_connect_old";
import setAuthToken from "../../utils/setAuthToken";
import { login } from "../../actions/auth";
import { setAlert } from "../../actions/alert";

const Login = ({ login, setAlert, selectedAccount }) => {
  document.title = 'Admin Panel | Login';

  let navigate = useNavigate();

  //perform logout when login page open
  useEffect(() => {
    setAuthToken("");
  }, []);

  //On login click
  const handleClick = () => {
    if (!selectedAccount) {
      setAlert("Connect Metamask", "warning");
      metamask_connect();
    } else {
      login(selectedAccount, navigate)
    };
  };


  return (
    <Box sx={{ "& button": { m: 1 } }}>
      <h1>
        SoundMint || Admin panel
        <br />
      </h1>
      <Button variant="contained" size="large" onClick={handleClick}>
        Login
      </Button>
    </Box>
  );
};

const mapStatetoProps = (state) => ({
  selectedAccount: state.auth.account,
});
export default connect(mapStatetoProps, { login, setAlert })(Login);
