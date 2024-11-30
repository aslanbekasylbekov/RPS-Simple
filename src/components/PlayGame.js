import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";

import contract from "../contract/abi.json";

const PlayGame = () => {
    const [choice, setChoice] = useState("");
    const [result, setResult] = useState("");

    const handlePlay = async () => {
        try {
            if (!choice) {
                alert("Select a choice first!");
                return;
            }
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const gameContract = new Contract(contract.address, contract.abi, signer);



            const tx = await gameContract.play(choice);
            await tx.wait();

            setResult("Game played successfully! Check history for results.");
        } catch (error) {
            console.error("Error playing game:", error);
            setResult("An error occurred. Ensure you're connected to the blockchain.");
        }
    };

    return (
        <div>
            <h2>Play Rock-Paper-Scissors</h2>
            <div>
                <button onClick={() => setChoice(0)}>Rock</button>
                <button onClick={() => setChoice(1)}>Paper</button>
                <button onClick={() => setChoice(2)}>Scissors</button>
            </div>
            <button onClick={handlePlay}>Play</button>
            {result && <p>{result}</p>}
        </div>
    );
};

export default PlayGame;
