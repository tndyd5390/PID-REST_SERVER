const CryptoJS = require("crypto-js");

const KEY = "test";

const AESEncode = (str, key) => {
    return CryptoJS.AES.encrypt(str, key).toString();
}

const AESDecode = (str, key) => {
    return CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8);
}

const SHA256Encode = (str) => {
    return CryptoJS.SHA256(str).toString();
}

module.exports = {
    AESDecode,
    AESEncode,
    SHA256Encode
}