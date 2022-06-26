import store from "../store";
import { WALLET_CONNECT, WALLET_DISCONNECT } from "../actions/types";
import { toast } from 'react-toastify';
import  Web3 from 'web3';

const metamask_connect = () => {
  let provider = window.ethereum;
  if (typeof provider !== "undefined") {
    if (typeof window.web3 !== 'undefined') {
      window.web3 = new Web3(window.ethereum);     
    } else {
        toast.warning("No Ethereum interface injected into browser. Read-only access");
    }

    window.ethereum.enable().then(function (accounts) {
        window.web3.eth.net.getId().then((netid) => {
            let wallet = accounts[0];                 
            store.dispatch({ type: WALLET_CONNECT, payload: accounts[0] });
        }).catch(function (err) {
            store.dispatch({ type: WALLET_DISCONNECT });
            localStorage.removeItem("token");
        });  
    }).catch(function (error) {
        // Handle error. Likely the user rejected the login
        console.error(error)
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
