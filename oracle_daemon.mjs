import fetch from 'node-fetch';
import Web3 from "web3";
import * as fs from "fs";

let myApiKey = fs.readFileSync("resources/api_key_Alchemy.txt")
let web3 = new Web3("wss://eth-ropsten.alchemyapi.io/v2/" + myApiKey);

function wait(ms) {
  return new Promise((resv) => {
    setTimeout(resv, ms);
  })
}

async function getProofs(key) {
  let ops = {
    headers: {
      Authorization: fs.readFileSync("resources/api_key_Umb.txt")
    }
  }
  let resp = await fetch("https://api.sbx.umb.network/proofs?keys=" + key + "&chainId=ethereum", ops);
  let body = await resp.json();
  console.log(body)
  return body
}

async function sendUpdate(argv) {
  let abi = JSON.parse(fs.readFileSync("contracts/Oracle.abi"));
  let cntr = new web3.eth.Contract(abi, cntr_Addr);
  let cntrTx =  cntr.methods.updateState(argv[0], argv[1], argv[2], argv[3]);
  let Tx = await web3.eth.accounts.signTransaction({
    from: web3.eth.defaultAccount,
    to: cntr_Addr,
    data: cntrTx.encodeABI(),
    gas: web3.utils.toHex(99999)
  }, acct.privateKey);
  let res = await web3.eth.sendSignedTransaction(Tx.rawTransaction);
  return res
}

async function main(delay) {
  console.log("Log: The daemon has started")
  console.log(fs.readFileSync("resources/privp.txt").toString());
  acct = await web3.eth.accounts.privateKeyToAccount(fs.readFileSync("resources/privp.txt").toString());
  web3.eth.defaultAccount = acct.address;

  let key = "BTC-USD";
  var dat;
  while (true) {
    let arr = new Array(4);
    dat = await getProofs(key);

    arr[0] = dat["data"]["block"]["blockId"];
    arr[1] = dat["data"]["leaves"][0]["proof"];
    arr[2] = "0x000000000000000000000000000000000000000000000000004254432d555344" // LeafKeyCoder.encode(dat["data"]["keys"]).toString('hex');
    arr[3] = dat["data"]["leaves"][0]["value"];

    console.log("Data: ", arr);
    try {
      await sendUpdate(arr);
      console.log("Log: The state has been updated successfully");
    } catch (err) {
      console.log("Log: An error has occurred: ", err);
    }
    await wait(delay);
  }
}

let cntr_Addr = fs.readFileSync("resources/contractAddress.txt").toString();
var acct;
var delay = 60000 * 3;
// delay = process.argv[3]
main(delay)
