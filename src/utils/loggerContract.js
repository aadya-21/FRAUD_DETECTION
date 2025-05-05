// src/utils/loggerContract.js
import { ethers } from "ethers";
import loggerABI from "./contractABI_logger"; // adjust path if needed

const contractAddress = "0x545EDC22C7d0b096d162605BF7d21C6D35E83251";

const getLoggerContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not detected");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, loggerABI, signer);
};

export default getLoggerContract;
