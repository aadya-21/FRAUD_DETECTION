import React, { useState } from "react";
import "../../index.css";
import { logTransactionLocally } from "../../utils/transactionLogger"; // helper to log locally

const TransactionForm = () => {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Checking...");

    const parsedAmount = Number(amount);
    const parsedTime = Number(time);

    try {
      // Heuristic fraud check
      const isFraud = parsedTime < 3 && parsedAmount > 10000;

      if (isFraud) {
        setMessage("❌ The transaction was flagged as fraudulent by heuristic.");
        await logTransactionLocally("You", receiver, parsedAmount, true);
        return;
      }

      // Fallback to ML model
      const response = await fetch("http://localhost:5500/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          time: parsedTime,
          transaction_amount: parsedAmount,
        }),
      });

      const result = await response.json();
      const mlPrediction = result.is_fraud;

      setMessage(mlPrediction ? "❌ Fraud detected by model" : "✅ Transaction is safe");
      await logTransactionLocally("You", receiver, parsedAmount, mlPrediction);
    } catch (err) {
      console.error("Error during fraud check or logging:", err);
      setMessage("❌ Failed to analyze transaction.");
    }

    setReceiver("");
    setAmount("");
    setTime("");
  };

  return (
    <div className="form-container">
      <h3>Submit Transaction for Analysis</h3>
      <input
        type="text"
        placeholder="Receiver Address"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Time (e.g., 0.1)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Transaction</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TransactionForm;
