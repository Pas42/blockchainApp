const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class KeyGenerate{
    constructor(username, password){
        this.username = username;
        this.password = password;
    }

    createKeys(username, password){
        const key = ec.genKeyPair((username + password).toString());
        const publicKey = key.getPublic('hex');
        const privateKey = key.getPrivate('hex');
        
        console.log('Private key: ', privateKey);
        console.log('Public key: ', publicKey);
    }
}

module.exports.KeyGenerate = KeyGenerate;
