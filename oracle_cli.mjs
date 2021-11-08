import Web3 from "web3";
import * as fs from "fs";
import { getProofs } from "./javascript/utils.mjs"
//let web3 = new Web3("http://localhost:8545");

let myApiKey = fs.readFileSync("resources/api_key_Alchemy.txt")
let web3 = new Web3("wss://eth-ropsten.alchemyapi.io/v2/" + myApiKey);

async function sendUpdate(argv) {
  let abi = JSON.parse(fs.readFileSync("contracts/Oracle.abi"));
  let cntr = new web3.eth.Contract(abi, cntr_Addr);
  let cntrTx =  cntr.methods.updateState(argv[0], argv[1], argv[2], argv[3]);
  let Tx = await web3.eth.accounts.signTransaction({
    from: web3.eth.defaultAccount,
    to: cntr_Addr,
    data: cntrTx.encodeABI(),
    gas: web3.utils.toHex(8000000)
  }, acct.privateKey);
  let res = await web3.eth.sendSignedTransaction(Tx.rawTransaction);
  console.log(res)
  // fs.writeFileSync("res.json", JSON.stringify(res))
  // console.log(res["events"]["stateUpdated"])
}

async function queryValue() {
  let abi = JSON.parse(fs.readFileSync("contracts/Oracle.abi"));
  let cntr = new web3.eth.Contract(abi, cntr_Addr);
  let cntrTx = cntr.methods.queryValue();
  let Tx = await web3.eth.accounts.signTransaction({
      from: web3.eth.defaultAccount,
      to: cntr_Addr,
      data: cntrTx.encodeABI(),
      gas: web3.utils.toHex(8000000)
  }, acct.privateKey);
  let res = await web3.eth.sendSignedTransaction(Tx.rawTransaction);
  console.log(res)
  // console.log("Value: ", res["events"]["storedValue"])
}

async function main() {
  console.log(fs.readFileSync("resources/privp.txt").toString());
  acct = await web3.eth.accounts.privateKeyToAccount(fs.readFileSync("resources/privp.txt").toString());
  web3.eth.defaultAccount = acct.address;
  if (process.argv[2] == "--query") {
    let crt_Value = await queryValue()
  } else if (process.argv[2] == "--update") {
    let dat = await getProofs("BTC-USD");
    let crt_Value = await sendUpdate(dat);
  }
}

let cntr_Addr = fs.readFileSync("resources/contractAddress.txt").toString();
console.log(cntr_Addr);
var acct;
main()
