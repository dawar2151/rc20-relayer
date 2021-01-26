/* eslint-disable import/first */
var ethUtil = require('ethereumjs-util')
var sigUtil = require('eth-sig-util')
var Eth = require('ethjs')
window.Eth = Eth
import config from "../config";
import Web3 from 'web3';
const Tx = require('ethereumjs-tx').Transaction
import parse_abi from './utils';
import { send_transaction } from './relayer-service';
// Instantiate web3
let web3
const ethEnabled = () => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      return true;
    }
    return false;
  }
if(!ethEnabled()) {  
 web3 = new Web3(config.node_api);
}else{
    web3 = window.web3;
}
// Instantiate smart contracts
let iMarkertContract = new web3.eth.Contract(parse_abi(), config.sm_address);
function connect () {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.enable()
      .catch(console.error)
    }
  }
// call smart contract function to save market object
export async function send_amount(recipient, amount){
    
    let nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress)  //count
    const content = iMarkertContract.methods.transfer(recipient, amount).encodeABI();
    const privateKey = Buffer.from(config.private_key,'hex');
    var rawTx = {
        from: window.ethereum.selectedAddress,
        nonce: nonce,
        to: config.sm_address,
        gas: '0x81B320', // Gas sent with each transaction (default: ~6700000)
        gasPrice: '0x4A817C800',
        value: '0x0',
        chainId: 4,
        data: content
    }
    web3.eth.signTransaction(rawTx).then(data=>{
      console.log(data);
    })
    // Initiate an sign transaction
    //let tx = new Tx(rawTx, { chain: 'rinkeby', hardfork: 'istanbul' });
    //tx.sign(privateKey);
    //let serializedTx = tx.serialize();
    //const raw = '0x' + serializedTx.toString('hex')
    
    // Broadcast the transaction
    //const receipt = await web3.eth.sendSignedTransaction(raw);
   // console.log(receipt);
   /*
   var from = web3.eth.accounts[0]
   web3.eth.eth.personal_sign(from, rawTx, function (err, result) {
     if (err) return console.error(err)
     console.log('SIGNED:' + result)
   })
   return null;
   */
  var msg = ethUtil.bufferToHex(new Buffer(JSON.stringify(rawTx), 'utf8'))
  // var msg = '0x1' // hexEncode(text)
  //console.log(msg)
  var from = window.ethereum.selectedAddress
  if (!from) return connect()

  /*  web3.personal.sign not yet implemented!!!
   *  We're going to have to assemble the tx manually!
   *  This is what it would probably look like, though:
    web3.personal.sign(msg, from) function (err, result) {
      if (err) return console.error(err)
      console.log('PERSONAL SIGNED:' + result)
    })
  */

   console.log('CLICKED, SENDING PERSONAL SIGN REQ')
 
  var params = [msg, from]
  var method = 'personal_sign'
 
  const signedTx = web3.eth.accounts.signTransaction(rawTx, `0x${config.private_key}`).then(result=>{
    console.log('PERSONAL SIGNED:' + JSON.stringify(result))
    const sgn = result


    let safeTransaction = {};
    safeTransaction.to=config.sm_address
    safeTransaction.value=0
    safeTransaction.data=content
    safeTransaction.operation=0
    safeTransaction.gasToken=''
    safeTransaction.safeTxGas=1000
    safeTransaction.dataGas=0
    safeTransaction.gasPrice=0
    safeTransaction.refundReceiver=''
    safeTransaction.nonce=nonce
    safeTransaction.signature=[{
      v:sgn.v,
      r:sgn.r,
      s:sgn.s
    }]
    console.log(JSON.stringify(safeTransaction));
    send_transaction('0x6b287983B0CFE1Ed27Affc1F1F06A49835632ff1', safeTransaction).then(result=>{
      console.log(result);
    }, error=>{
      console.log(error);
    })
    
  })
}

export async function get_balance(address){
    let balance  = await iMarkertContract.methods.balanceOf(address).call();
    return balance;
}
