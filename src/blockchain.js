// using SHA256. could use a better encryption scheme.
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(sighningKey){
        if(sighningKey.getPublic('hex') != this.fromAddress){
            throw new Error("You cannot sign transcations for other wallets!");
        }

        const hashTx = this.calculateHash();
        const sig = sighningKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
         if(this.fromAddress == null)
            return true;

        if(!this.signature || this.signature.length == 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

// Each block elements(find the proper term)
class Block {
    constructor(timestamp, messageData, previousHash = ''){
        this.timestamp = timestamp;
        this.messageData = messageData;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    // hash calculating
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined : " + this.hash);
    }

    hasValidTransaction(){
        for(const tx of this.transaction){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

// creating blockchain
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransaction = [];
        this.miningReward = 100;
    }

    // genesis block
    createGenesisBlock(){
        return new Block(0, "27/06/2022", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    mindPendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address')
        }

        if(!transaction.isValid()){
            throw new Error('Cannont add invalid trasaction to chain')
        }

        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.messageData){
                // if sending transaction, balance reduced
                if(trans.fromAddress == address){
                    balance -= trans.amount;
                }
                // the opposite
                if(trans.toAddress == address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransaction()){
                return false;
            }

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;