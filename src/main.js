const{Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('8ec5c494f2a29176a5d097071d603a1ca79140368ced337c5b01e315f3848bdb');
const myWalletAddress = myKey.getPublic('hex');

// testing purposes
let messageCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key for other party', 10);
tx1.signTransaction(myKey);
messageCoin.addTransaction(tx1);

// console.log("Mining block 1..");
// messageCoin.addBlock(new Block(1, "28/06/2022", "Hello World"));
// console.log("Mining block 2..");
// messageCoin.addBlock(new Block(2, "29/06/2022", "Hello World 2.0"));

// console.log(JSON.stringify(messageCoin, null, 4));
// console.log('Is blockchain valid? ' + messageCoin.isChainValid());

// messageCoin.chain[1].data = "Hello wolrd";
// console.log(JSON.stringify(messageCoin, null, 4));
// console.log('Is blockchain valid? ' + messageCoin.isChainValid());

console.log('\n Starting the miner...')
messageCoin.mindPendingTransactions(myWalletAddress);

console.log('\n Balance of Me is ', messageCoin.getBalanceOfAddress(myWalletAddress))

// console.log('\n Starting the miner again...')
// messageCoin.mindPendingTransactions('some-random-address');

// console.log('\n Balance of Me is ', messageCoin.getBalanceOfAddress('some-random-address'))