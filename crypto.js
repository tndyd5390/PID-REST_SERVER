const CryptoJS = require("crypto-js");

const key = "test";

const AESEncode = (str) => {
    return CryptoJS.AES.encrypt(str, key).toString();
}

const AESDecode = (str) => {
    return CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8);
}

const SHA256Encode = (str) => {
    var aes = AESEncode(key);
    var str = aes + str;
    return CryptoJS.SHA256(str).toString();
}

module.exports = {
    AESDecode,
    AESEncode,
    SHA256Encode
}