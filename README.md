# Umbrella Layer2 Oracle
## Introduction
This repository implements an oracle for Layer-2 data from the Umbrella Network. Umbrella network provides data from two different sources, one on-chain, and the other off-chain, and this project provides access to the off-chain data(Layer-2 data) for on-chain applications. It consists of an on-chain oracle contract, which I deployed to Ropsten at 0x724f120b0CA1D35Bada2eb06C28A6AFA9f75217A, and an off-chain Node.js daemon connected to a node provider (Alchemy in my test case).

The oracle contract can be queried by any contract on the same chain it was deployed and provides access to specific price data for a certain currency pair chosen at random for testing purposes. The daemon, which handles all interactions with Umbrella Network through an API and HTTP requests, can be set to periodically query the network for data updates and, subsequently, upload them to the oracle contract. All data updates are then verified on-chain against the root hash of a Merkle tree stored in Umbrella's verifier contract at 0x2f83f9d4Cf666dB3db0801E0E05a84EB7d14E639.

[![Etherscan Screenshot](https://raw.githubusercontent.com/FrGS-0/Umbrella_Layer2_Oracle/main/resources/Screenshot.PNG?token=AV7BMIP3MPYP4CFPZPHYPQTBREWW6)]

## Running local tests
To run the contracts locally, first, start ganache-cli or your tool of choice and edit the source code to connect to it. Most of the steps taken are the same in all the cases, but the local oracle needs access to a validator contract with a stored root hash in order to work properly. cntr_Validator.sol in the contracts folder implements a minimalistic verifier contract created by taking only the necessary components from the original contract and can be compiled and deployed to serve all the necessary functions as long as valid root hash and block id are inputted to the constructor during creation.

Note: If you are going to run tests yourself, don't forget to populate the files api_key_Alchemy.txt, privp.txt,  api_key_Umb.txt in the resources folder with your Alchemy API key, your wallet private key, and your Umbrella API key, respectively.

## Runing tests on Ropsten
The oracle can be compiled and deployed independently of any other component and the caller contract can be any contract that interacts with the queryValue() function from the oracle contract in the same way. Notice, however, that the daemon needs to be running and connected to the network for the requests to be fulfilled. You can accomplish this by installing all the necessary dependencies and running
```
node oracle_daemon.mjs
```

The following video demonstrates the walkthrough of interacting with the oracle and running the daemon:

[![Video](https://raw.githubusercontent.com/FrGS-0/Umbrella_Layer2_Oracle/main/resources/Video%20Screenshot.PNG?token=AV7BMIOO2VDH6DTJNW6GAP3BREXP2)](https://www.youtube.com/watch?v=vHYcKzbC6HU)

As shown in the video, the contract can be easily seen using a block explorer like Etherscan (Access: https://ropsten.etherscan.io/address/0x724f120b0CA1D35Bada2eb06C28A6AFA9f75217A). Since I wanted to implement a basic security system, the internal state of the contract can only be changed by the address that created it (In this case my test address). However, its value can be queried by anyone inside or outside the blockchain through the queryValue()	 function which returns the current value of the value variable and throws a storedValue event.

## Conclusion and possible improvements.
I started working on this project awfully near the deadline and, though it is in a fairly working state, I didn't have time to implement all the features I would have liked to. I could not, for example, implement a reward system for the oracle (Using the UMB token, preferentially), and thus far it has only two available functions (queryValue and updateState) and it can only store a single type of value ("BTC-USD"). Of course, all these improvements could be easily implemented with some more time and work.
