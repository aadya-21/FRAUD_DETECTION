import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import contractABI from "../utils/contractABI.jsx";
import "../index.css";
import TransactionForm from "./components/TransactionForm";
import TransactionTable from "./components/TransactionTable";

const contractAddress = "0x052d5D86568BEf96EaFa3b0A049Bc4dc11D10B93";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, isOwner } = location.state || {};

  const [selectedFunction, setSelectedFunction] = useState(null);
  const [targetAddress, setTargetAddress] = useState("");
  const [message, setMessage] = useState("");
  const [checkAddress, setCheckAddress] = useState("");
  const [frozenStatus, setFrozenStatus] = useState(null);
  const [newOwner, setNewOwner] = useState("");
  const [contractStatus, setContractStatus] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const [fraudThreshold, setFraudThreshold] = useState(1000);
  const [penaltyAmount, setPenaltyAmount] = useState(500);
  const [transactions, setTransactions] = useState([]);
  const [fraudulentTransactions, setFraudulentTransactions] = useState([]);
  const [fraudUsers, setFraudUsers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]); // NEW

  const handleTransactionLogged = (tx) => {
    setAllTransactions((prev) => [...prev, tx]);
  };

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  const sendEth = async () => {
    if (!window.ethereum) {
      setMessage("Ethereum provider not found");
      return;
    }

    if (!recipient || !amount) {
      setMessage("Please enter a valid recipient address and amount.");
      return;
    }

    try {
      const predictionResponse = await fetch("http://localhost:5500/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: Math.floor(Date.now() / 1000),
          transaction_amount: parseFloat(amount),
        }),
      });

      const predictionResult = await predictionResponse.json();

      if (predictionResult.is_fraud) {
        alert("🚨 This transaction was flagged as fraud! It has been blocked.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amountInWei = ethers.parseEther(amount);
      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountInWei,
      });

      await tx.wait();
      const newTx = {
        sender: account,
        receiver: recipient,
        amount,
        timestamp: new Date().toLocaleString(),
        isFraud: false,
      };
      handleTransactionLogged(newTx);
      setMessage(`✅ Successfully sent ${amount} ETH to ${recipient}`);
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Error sending ETH:", error);
      setMessage("❌ Transaction failed.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <button onClick={() => setSelectedFunction("sendEth")}>Send ETH</button>
        {isOwner && (
          <>
          <button onClick={() => setSelectedFunction("transactionAnalysis")}>🧠 Transaction Analysis</button>

            <button onClick={() => setSelectedFunction("freezeAccount")}>Freeze Account</button>
            <button onClick={() => setSelectedFunction("unfreezeAccount")}>Unfreeze Account</button>
            <button onClick={() => setSelectedFunction("transferOwnership")}>Transfer Ownership</button>
            <button onClick={() => setSelectedFunction("pauseContract")}>Pause Contract</button>
            <button onClick={() => setSelectedFunction("resumeContract")}>Resume Contract</button>
            <button onClick={() => setSelectedFunction("updateFraudDetectionThreshold")}>Update Fraud Detection Threshold</button>
            <button onClick={() => setSelectedFunction("updatePenaltyAmount")}>Update Penalty Amount</button>
          </>
        )}
        <button onClick={() => setSelectedFunction("checkFrozenStatus")}>Check Frozen Status</button>
        <button onClick={() => setSelectedFunction("viewTransactionLogs")}>View Transactions</button>
        <button onClick={() => setSelectedFunction("transactionAnalysis")}>🧠 Transaction Analysis</button>
      </div>

      <div className="main-content">
        <h1>Welcome, {account}</h1>
        <p>Contract Status: {contractStatus ? "Paused ⏸️" : "Active ✅"}</p>
        



        {selectedFunction === "sendEth" && (
          <div className="form-container">
            <h3>Send ETH</h3>
            <input
              type="text"
              placeholder="Recipient address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            
            <input
              type="text"
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={sendEth}>Submit Transaction</button>
          </div>
        )}

{selectedFunction === "transactionAnalysis" && (
  <>
    <TransactionForm
      onTransactionLogged={(tx) =>
        setTransactions((prev) => [...prev, tx])
      }
    />
    <TransactionTable transactions={transactions} />
  </>
)}


        {selectedFunction === "viewTransactionLogs" && (
          <TransactionTable transactions={allTransactions} />
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default Dashboard;
