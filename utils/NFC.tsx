import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';

function encrypt(plaintext:string, key:string) {
    let ciphertext = CryptoJS.AES.encrypt(plaintext, key);
    return ciphertext
}

function decrypt(ciphertext:string, key:string) {
    let plaintext = CryptoJS.AES.decrypt(ciphertext, key);
    return plaintext
}

const publicKey