'use strict';

const{Blockchain, Message} = require('./messaging.js');
const{KeyGenerate} = require('./keygenerator.js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('ad37ec9481950914580a3fdbe6b4475c1a19973519245d69eeb9547dda78a0bd');
const myWalletAddress = myKey.getPublic('hex');

const theirKey = ec.keyFromPrivate('d59c5bde687dbbb247e5c258ff83d56d2a5088bd4b4d9a08fa8c08837b1d75c3');
const theirWalletAddress = theirKey.getPublic('hex');
// testing purposes

let messageCoin = new Blockchain();
// const msg1 = new Message(myWalletAddress, theirWalletAddress, "Hello World");
// msg1.signMessage(myKey);
// messageCoin.createMessage(msg1);

// const msg2 = new Message(theirWalletAddress, myWalletAddress, "Hello World3.0");
// msg2.signMessage(theirKey);
// messageCoin.createMessage(msg2);

// const msg3 = new Message(theirWalletAddress, myWalletAddress, "HSome random data");
// msg3.signMessage(theirKey);
// messageCoin.createMessage(msg3);

console.log(JSON.stringify(messageCoin, null, 5));
console.log('Is blockchain valid? ' + messageCoin.isChainValid());

console.log('All Messages ' + messageCoin.getMessages());
function createKey() {
    const user = document.getElementById("uname").textContent;
    const pass = document.getElementById("pword").textContent;

    const key = new KeyGenerate();
    const keys = key.createKeys(user, pass);
    console.log('Keys: ' + keys.getPublic('hex'));
}

function addMessage(data){
    const data = document.getElementById("chatInsert").textContent;

    const msg = new Message(myWalletAddress, theirWalletAddress, data);
    msg.signMessage(myKey);
    messageCoin.createMessage(msg);
    console.log(Json.stringify(messageCoin, null, 5));
}


