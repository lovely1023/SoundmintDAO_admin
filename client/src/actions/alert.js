import { toast } from 'react-toastify';

export const setAlert =
  (msg, alertType, timeout = 5000) =>
    (dispatch) => {
      toast.dismiss();
      if (alertType === 'success') {
        toast.success(msg, {
          position: "top-center",
          autoClose: timeout,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (alertType === 'warn') {
        toast.warn(msg, {
          position: "top-center",
          autoClose: timeout,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (alertType === 'info') {
        toast.info(msg, {
          position: "top-center",
          autoClose: timeout,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(msg, {
          position: "top-center",
          autoClose: timeout,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
