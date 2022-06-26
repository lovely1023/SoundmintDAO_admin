import store from "../store";
import { WALLET_CONNECT, WALLET_DISCONNECT } from "../actions/types";
import { toast } from 'react-toastify';

const metamask_connect = () => {
  let provider = window.ethereum;
  if (typeof provider !== "undefined") {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        store.dispatch({ type: WALLET_CONNECT, payload: accounts[0] });
        // console.log("Selected Account is " + accounts[0]);
      })
      .catch((err) => {
        store.dispatch({ type: WALLET_DISCONNECT });
        localStorage.removeItem("token");
      });
    window.ethereum.enable().then(async ()=>{
      const netid = await window.web3.eth.net.getId();
      console.log(netid)
    })
    window.ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length >= 2) {
        store.dispatch({ type: WALLET_CONNECT, payload: accounts[0] });
        console.log("Selected Account change is " + accounts[0]);
      } else if (accounts.length === 0) {
        console.error("No account is found");
        store.dispatch({ type: WALLET_DISCONNECT });
        localStorage.removeItem("token");
        window.location.reload();
      }
    });
  } else {
    toast.dismiss();
    toast.warn("Please install Metamask", { position: "top-center" })
  }
};

export default metamask_connect;
