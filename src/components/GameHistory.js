import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";

import contract from "../contract/abi.json";

const GameHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
              const provider = new BrowserProvider(window.ethereum);
              const signer = await provider.getSigner();
              const gameContract = new Contract(contract.address, contract.abi, signer);
              

                const games = await gameContract.getHistory();
                setHistory(games);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div>
            <h2>Game History</h2>
            <ul>
                {history.map((game, index) => (
                    <li key={index}>
                        Player: {game.player}, Choice: {game.playerChoice}, Opponent: {game.opponentChoice}, Result: {game.result}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameHistory;
