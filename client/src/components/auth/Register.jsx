import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Box, TextField, Button } from "@mui/material";
import Grid from '@mui/material/Grid';

import metamask_connect from "../../utils/metamask_connect";
import { register } from "../../actions/auth";
import { setAlert } from "../../actions/alert";


const Register = ({ setAlert, register, selectedAccount }) => {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState([]);

  //form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    account: ""
  });

  const { name, email } = formData;

  //Handle textfield value change 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage([]);
  };

  //Register click
  const submit = () => {
    if (!selectedAccount) {
      setAlert("Connect Metamask", "warning");
      metamask_connect();
      return;
    }

    //If validate is true
    if (Validate()) {
      register(name, email, selectedAccount, navigate);
      setErrorMessage([]);
    }
  };

  //Validate fields 
  const Validate = () => {
    let error = {};

    if (!name) {
      error.name = "Name is required.";
    }
    if (!email) {
      error.email = "Email is required.";
    }

    //email validate
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      error.email = "Invalid email address.";
    }
    if (Object.keys(error).length > 0) {
      setErrorMessage(error);
      return false;
    }

    return true;
  }

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "60ch" },
        width: 500,
        maxWidth: '100%',
      }}

      autoComplete="off"
    >
      <Grid container spacing={1} direction="row" justifyContent="center">
        <Grid item xs={12}>
          <TextField
            error={errorMessage.name ? true : false}
            required
            label="Name"
            name="name"
            onChange={handleChange}
            helperText={errorMessage.name && errorMessage.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={errorMessage.email ? true : false}
            required
            label="Email"
            type="email"
            name="email"
            onChange={handleChange}
            helperText={errorMessage.email && errorMessage.email}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            label="Account"
            name="account"
            value={
              selectedAccount !== null
                ? selectedAccount
                : "Could not get wallet account"
            }
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" size="large" onClick={submit}>
            Register
          </Button>
        </Grid>
      </Grid>

    </Box>
  );
};

const mapStateToProps = (state) => ({
  selectedAccount: state.auth.account,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
