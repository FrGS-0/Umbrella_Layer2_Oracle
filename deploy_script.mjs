import Web3 from "web3";
import * as fs from "fs";
import { getProofs } from "./javascript/utils.mjs"
import fetch from 'node-fetch';

let myApiKey = fs.readFileSync("resources/api_key_Alchemy.txt");
let web3 = new Web3("wss://eth-ropsten.alchemyapi.io/v2/" + myApiKey);

async function deployCntr(argv, abiPath, binPath) {
  let abi = JSON.parse(fs.readFileSync(abiPath));
  let bin = "0x" + fs.readFileSync(binPath);
  let contracted = new web3.eth.Contract(abi);
  let payl = {
    data: bin,
    arguments: argv
  }
  let cntrTx = contracted.deploy(payl);
  let Tx = await web3.eth.accounts.signTransaction({
      data: cntrTx.encodeABI(),
      gas: await cntrTx.estimateGas()
  }, acct.privateKey);
  let res = await web3.eth.sendSignedTransaction(Tx.rawTransaction);
  console.log(res);
  console.log("Address: " + res.contractAddress);
  return res.contractAddress
}

async function setup() {
  let dat = await getProofs("BTC-USD");
  let argv = [validatorCntr, web3.eth.defaultAccount, dat[0], dat[1], dat[2], dat[3]];
  // let argv = [1234, "0x2f83f9d4Cf666dB3db0801E0E05a84EB7d14E639"]
  let cntr = await deployCntr(argv, "contracts/Oracle.abi", "contracts/Oracle.bin");
}

async function main() {
  console.log(fs.readFileSync("resources/privp.txt").toString());
  acct = await web3.eth.accounts.privateKeyToAccount(fs.readFileSync("resources/privp.txt").toString());
  web3.eth.defaultAccount = acct.address;
  setup()
}

var acct;
let validatorCntr = "0x2f83f9d4Cf666dB3db0801E0E05a84EB7d14E639";
main()
