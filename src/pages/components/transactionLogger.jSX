const LOCAL_STORAGE_KEY = "localTransactionLogs";

export const logTransactionLocally = async (sender, receiver, amount, isFraud) => {
  const txs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  txs.push({
    sender,
    receiver,
    amount,
    timestamp: new Date().toISOString(),
    isFraud,
  });
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(txs));
};

export const getLocalTransactions = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
};
