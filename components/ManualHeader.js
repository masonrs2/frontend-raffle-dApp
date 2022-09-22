import React from "react";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";

const ManualHeader = () => {
    /* Allows a users metamask to connect to the website */
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis();

  useEffect(function () {
    if(isWeb3Enabled) return
    enableWeb3()
    if(typeof window !== "undefined") {
        if(window.localStorage.getItem("connected")){
            enableWeb3()
        }
    }
  },[isWeb3Enabled])

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
        console.log(`Account changed to ${account}`)
        if(account == null) {
            window.localStorage.removeItem("connected")
            deactivateWeb3()
            console.log("Null account found")
        } 
    })
  },[])

  

  return (
    <div>
      {account ? (
        <div>Connected to {account.slice(0,4)}...{account.slice(account.length-4)} </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3()
            if (typeof window !== "undefined"){
                window.localStorage.setItem("connect", "inject")
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default ManualHeader;




