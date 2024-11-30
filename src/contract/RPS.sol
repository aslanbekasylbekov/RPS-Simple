// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    enum Choice { Rock, Paper, Scissors }
    struct Game {
        address player;
        Choice playerChoice;
        Choice opponentChoice;
        string result; 
    }

    Game[] public games;
    mapping(address => uint256) public playerGameCount;

    event GamePlayed(address indexed player, string result);

    function play(Choice _choice) public {
        // Simulate opponent choice (random for simplicity, better use Chainlink VRF in production)
        Choice opponentChoice = Choice(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 3);

        // Determine result
        string memory result;
        if (_choice == opponentChoice) {
            result = "Draw";
        } else if (
            (_choice == Choice.Rock && opponentChoice == Choice.Scissors) ||
            (_choice == Choice.Paper && opponentChoice == Choice.Rock) ||
            (_choice == Choice.Scissors && opponentChoice == Choice.Paper)
        ) {
            result = "Win";
        } else {
            result = "Lose";
        }

        // Save the game
        games.push(Game(msg.sender, _choice, opponentChoice, result));
        playerGameCount[msg.sender]++;

        // Emit event
        emit GamePlayed(msg.sender, result);
    }

    function getHistory() public view returns (Game[] memory) {
        return games;
    }
}
