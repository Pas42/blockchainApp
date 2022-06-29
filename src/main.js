const{Blockchain, Message} = require('./messaging.js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('ad37ec9481950914580a3fdbe6b4475c1a19973519245d69eeb9547dda78a0bd');
const myWalletAddress = myKey.getPublic('hex');

const theirKey = ec.keyFromPrivate('d59c5bde687dbbb247e5c258ff83d56d2a5088bd4b4d9a08fa8c08837b1d75c3');
const theirWalletAddress = theirKey.getPublic('hex');
// testing purposes

let messageCoin = new Blockchain();
const msg1 = new Message(myWalletAddress, theirWalletAddress, "Hello World");
msg1.signMessage(myKey);
messageCoin.createMessage(msg1);

const msg2 = new Message(theirWalletAddress, myWalletAddress, "Hello World3.0");
msg2.signMessage(theirKey);
messageCoin.createMessage(msg2);

console.log(JSON.stringify(messageCoin, null, 5));
console.log('Is blockchain valid? ' + messageCoin.isChainValid());