import { useState, useEffect } from "react";
import InitializeWalletComponent from "./InitializeWalletComponent";
import LoadedWalletComponent from "./LoadedWalletComponent";

const WalletComponent = () => {
  const [activeWallet, setActiveWallet] = useState(null);
  const [error,setError] = useState(false);
  const [walletName,setWalletName] = useState(null);
  const [walletBalance,setWalletBalance] = useState(null);

  async function initialLoad() {
    try {
      // check if the wallet exists on localStorage
      // if so, set it to the activeWallet
      const walletId = localStorage.getItem("walletid");
      if (walletId) {
        setActiveWallet(walletId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchWalletDetails(walletId) {
    try {
      // fetch wallet details for walletId
      const response = await fetch(`/wallet/${walletId}`,{method:"GET"}).then(res=>res.json());
      if(response === "FAIL"){
        setError(true)
        return
      }

      const { name, balance } = response;
      setWalletName(name);
      setWalletBalance(balance);
      // set wallet details for walletId
      // update ui to show change in wallet state
    } catch (error) {
      console.log("error fetching wallet details", error);
      setError(true);

    }
  }

  useEffect(() => {
    initialLoad();
  }, []);

  useEffect(() => {
    if (activeWallet) {
      fetchWalletDetails(activeWallet);
    }
  }, [activeWallet]);

  return error ? (
    "Please refresh page"
  ) : activeWallet ? (
    <LoadedWalletComponent walletBalance={walletBalance} walletName={walletName} walletId={activeWallet} setWalletBalance={setWalletBalance} setError={setError}/>
  ) : (
    <InitializeWalletComponent setWalletBalance={setWalletBalance} setWalletName={setWalletName} setActiveWallet={setActiveWallet} setError={setError} />
  );
};

export default WalletComponent;
