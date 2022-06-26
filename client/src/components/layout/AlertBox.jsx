import React from "react";
import { connect } from "react-redux";

import { Alert, Stack } from "@mui/material";

const AlertBox = ({ alerts }) => {
  return (
    <div className="alert-wrapper">
      <Stack sx={{ width: "100%" }} spacing={2}>
        {alerts.map((alert) => (
          <Alert key={alert.id} severity={alert.alertType}>
            {alert.msg}
          </Alert>
        ))}
      </Stack>
    </div>
  );
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(AlertBox);
