import fetch from 'node-fetch';
import * as fs from "fs";

async function getProofs(key) {
  let ops = {
    headers: {
      Authorization: fs.readFileSync("resources/api_key_Umb.txt")
    }
  }
  let resp = await fetch("https://api.sbx.umb.network/proofs?keys=" + key + "&chainId=ethereum", ops);
  let dat = await resp.json();
  let arr = new Array(4);

  arr[0] = dat["data"]["block"]["blockId"];
  arr[1] = dat["data"]["leaves"][0]["proof"];
  arr[2] = "0x000000000000000000000000000000000000000000000000004254432d555344" // LeafKeyCoder.encode(dat["data"]["keys"]).toString('hex');
  arr[3] = dat["data"]["leaves"][0]["value"];

  console.log(arr)
  return arr
}

export { getProofs };
