import React, { useEffect, useState } from "react";
import "../../index.css";
import { getLocalTransactions } from "../../utils/transactionLogger";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = () => {
    const txs = getLocalTransactions();
    setTransactions(txs);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="table-container">
      <h3>Transaction Log</h3>
      <button onClick={fetchTransactions}>🔄 Refresh</button>
      <table>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Amount (ETH)</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td>{tx.sender}</td>
              <td>{tx.receiver}</td>
              <td>{tx.amount}</td>
              <td>{new Date(tx.timestamp).toLocaleString()}</td>
              <td>{tx.isFraud ? "❌ Fraud" : "✅ Safe"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
