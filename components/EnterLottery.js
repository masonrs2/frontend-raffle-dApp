import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

const EnterLottery = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); //pull out chainId obj and rename it as chainIdHex
  const chainId = parseInt(chainIdHex); //create new var called chainId
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  /* State Variables */
  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const completedTransactionNotification = useNotification(); //dispatch

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = (await getRecentWinner()).toString();

    setNumberOfPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
    setEntranceFee(entranceFeeFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI;
  };

  const handleNewNotification = () => {
    completedTransactionNotification({
      type: "info",
      message: "Transaction Completed!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };

  const enterRaffleOnClick = async () => {
    await enterRaffle({
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  };

  msgValue: return (
    <div className="p-5">
      {raffleAddress ? (
        <div>
          <button
            onClick={enterRaffleOnClick}
            disabled={isLoading || isFetching}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Lottery</div>
            )}
          </button>
          <div>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH{" "}
          </div>
          <div> Number of Players in Lottery: {numberOfPlayers} </div>
          <div> Recent Winner: {recentWinner} </div>
        </div>
      ) : (
        <div> No Raffle Address detected</div>
      )}
    </div>
  );
};

export default EnterLottery;
