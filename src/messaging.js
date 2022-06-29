const { SHA256 } = require("crypto-js");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Message {
    constructor(from, to, message) {
        this.from = from;
        this.to = to;
        this.message = message;
    }

    calculateHash() {
        return SHA256(this.from + this.to + this.message).toString();
    }

    signMessage(signingKey) {
        if (signingKey.getPublic('hex') !== this.from) {
            throw new Error("You cannot send messages from this account");
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (this.fromAddress == null)
            return true;

        if (!this.signature || this.signature.length == 0) {
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp, JSON.stringify(this.data) + this.nonce).toString();
    }

    // to increase difficuly to blockchain when mining
    // not using cause this is mostly for messaging initially
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined : " + this.hash);
    }

    hasValidMessage() {
        for (const tx of this.message) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        // this.difficulty = 3;
        this.pendingMessage = [];
        // this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/01/2017", "Genesis Hello", "0");
    }

    getLastesBlock() {
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLastesBlock().hash;
    //     newBlock.hash = newBlock.calculateHash();
    //     // newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    //
    //  @not using
    //
    minePendingMessages(mineingRewardAddress) {
        let block = new Block(Date.now(), "message input", "");
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingMessage = [
            // new Message(null, mineingRewardAddress, this.miningReward)
            new Message(null, mineingRewardAddress)
        ];
    }

    createMessage(message) {
        if (!message.from || !message.to) {
            throw new Error('Message must include from and to address')
        }

        if (!message.isValid()) {
            throw new Error('Cannont add invalid message to chain')
        }
        this.pendingMessage.push(message);
    }


    //
    //  @not using
    //
    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.messageData) {
                // if sending transaction, balance reduced
                if (trans.fromAddress == address) {
                    balance -= trans.amount;
                }
                // the opposite
                if (trans.toAddress == address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!currentBlock.hasValidMessage()) {
                return false;
            }

            if (currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash != previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Message = Message;
