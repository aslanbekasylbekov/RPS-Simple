import { ethers } from "ethers";
import ContractABI from "./ContractABI.json";

const contractAddress = "0x823fcBfDBE87928B38d15d5a967BBe6021DDA14a";

export const getContract = (provider) => {
  return new ethers.Contract(contractAddress, ContractABI, provider.getSigner());
};

export const playGame = async (provider, choice) => {
  const contract = getContract(provider);
  const tx = await contract.play(choice); // choice is an enum value (0, 1, or 2)
  await tx.wait();
};

export const fetchHistory = async (provider) => {
  const contract = getContract(provider);
  const games = await contract.getHistory();
  return games.map((game) => ({
    player: game.player,
    playerChoice: game.playerChoice,
    opponentChoice: game.opponentChoice,
    result: game.result,
  }));
};
