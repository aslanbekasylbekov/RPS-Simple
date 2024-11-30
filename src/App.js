import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Button, Form, Card, Container, Row, Col } from "react-bootstrap";

const CONTRACT_ADDRESS = "0x514086B5041f0127aD90C658CA7Ca346B802d984";
const CONTRACT_ABI = [
    [
        {
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "fundContract",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "outcome",
                    "type": "uint256"
                }
            ],
            "name": "GetGameOutcome",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_playerOneChoice",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_playerTwoChoice",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_gameStake",
                    "type": "uint256"
                }
            ],
            "name": "playGame",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "Received",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getContractBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getMsgSender",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "playerAddress",
                    "type": "address"
                }
            ],
            "name": "getPlayerBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "playerBalances",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState(0);
  const [playerBalance, setPlayerBalance] = useState(0);
  const [stake, setStake] = useState("");
  const [playerOneChoice, setPlayerOneChoice] = useState("");
  const [playerTwoChoice, setPlayerTwoChoice] = useState("");
  const [gameResult, setGameResult] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.requestAccounts();
        setAccount(accounts[0]);
        const rpsContract = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        setContract(rpsContract);
      } else {
        alert("Please install MetaMask!");
      }
    };
    initWeb3();
  }, []);

  const fetchBalances = async () => {
    if (contract && account) {
      const contractBal = await contract.methods.getContractBalance().call();
      setContractBalance(web3.utils.fromWei(contractBal, "ether"));
      const playerBal = await contract.methods.getPlayerBalance(account).call();
      setPlayerBalance(web3.utils.fromWei(playerBal, "ether"));
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = e.target.elements.depositAmount.value;
    await contract.methods.deposit().send({
      from: account,
      value: web3.utils.toWei(amount, "ether"),
    });
    fetchBalances();
  };

  const handleWithdraw = async () => {
    await contract.methods.withdraw().send({ from: account });
    fetchBalances();
  };

  const handleFundContract = async (e) => {
    e.preventDefault();
    const amount = e.target.elements.fundAmount.value;
    await contract.methods.fundContract().send({
      from: account,
      value: web3.utils.toWei(amount, "ether"),
    });
    fetchBalances();
  };

  const handlePlayGame = async (e) => {
    e.preventDefault();
    const result = await contract.methods
      .playGame(playerOneChoice, playerTwoChoice, web3.utils.toWei(stake, "ether"))
      .send({ from: account });
    setGameResult(result.events.GetGameOutcome.returnValues.outcome);
    fetchBalances();
  };

  return (
    <Container>
      <h1 className="text-center mt-4">Rock-Paper-Scissors Game</h1>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Account</Card.Title>
              <Card.Text>{account || "Not connected"}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Contract Balance</Card.Title>
              <Card.Text>{contractBalance} ETH</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Your Balance</Card.Title>
              <Card.Text>{playerBalance} ETH</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Form onSubmit={handleFundContract}>
            <Form.Group>
              <Form.Label>Fund Contract</Form.Label>
              <Form.Control type="text" name="fundAmount" placeholder="Amount in ETH" />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">Fund</Button>
          </Form>
        </Col>
        <Col>
          <Form onSubmit={handleDeposit}>
            <Form.Group>
              <Form.Label>Deposit Funds</Form.Label>
              <Form.Control type="text" name="depositAmount" placeholder="Amount in ETH" />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">Deposit</Button>
          </Form>
        </Col>
        <Col>
          <Button variant="danger" onClick={handleWithdraw} className="mt-4">Withdraw</Button>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Form onSubmit={handlePlayGame}>
            <Form.Group>
              <Form.Label>Player 1 Choice</Form.Label>
              <Form.Control
                type="text"
                placeholder="rock, paper, scissors"
                value={playerOneChoice}
                onChange={(e) => setPlayerOneChoice(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Player 2 Choice</Form.Label>
              <Form.Control
                type="text"
                placeholder="rock, paper, scissors"
                value={playerTwoChoice}
                onChange={(e) => setPlayerTwoChoice(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Stake (ETH)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Stake in ETH"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" type="submit" className="mt-2">Play Game</Button>
          </Form>
        </Col>
      </Row>

      {gameResult !== null && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Game Result</Card.Title>
                <Card.Text>
                  {gameResult === "0" && "It's a draw!"}
                  {gameResult === "1" && "Player 1 wins!"}
                  {gameResult === "2" && "Player 2 wins!"}
                  {gameResult === "3" && "Invalid game!"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default App;
