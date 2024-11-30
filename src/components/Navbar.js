import React, { useState } from "react";

const Navbar = () => {
    const [account, setAccount] = useState("");

    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    return (
        <nav>
            <button onClick={connectWallet}>Connect Wallet</button>
            {account && <p>Connected: {account}</p>}
        </nav>
    );
};

export default Navbar;
