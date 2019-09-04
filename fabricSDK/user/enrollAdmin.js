'use strict';
var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');
var path = require('path');
var util = require('util');
var os = require('os');
var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;
var store_path = path.join(__dirname, '../hfc-key-store');
const CA_IP = "http://localhost:7054";

const enrollAdmin = async() => {
    try{
        var state_store = await Fabric_Client.newDefaultKeyValueStore({path: store_path});
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        var	tlsOptions = {
            trustedRoots: [],
            verify: false
        };
        fabric_ca_client = new Fabric_CA_Client(CA_IP, tlsOptions , 'ca.example.com', crypto_suite);
        var user_from_store = await fabric_client.getUserContext("admin", true);
        if(user_from_store && user_from_store.isEnrolled()){
            admin_user = user_from_store;
            return null;
        } else {
            var enrollment = await fabric_ca_client.enroll({
                enrollmentID: 'admin',
                enrollmentSecret: 'adminpw'
            });
            var user = await fabric_client.createUser({
                username: 'admin',
                mspid: 'Org1MSP',
                cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
            });
            admin_user = user;
            return await fabric_client.setUserContext(admin_user);
        }
    }catch(err) {
        console.log(err);
    }
}

const registerUser = async(admin, user, affiliation) =>{
    try{
        var state_store = await Fabric_Client.newDefaultKeyValueStore({path: store_path});
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        var tlsOptions = {
            trustedRoots: [],
            verify: false
        };
        fabric_ca_client = new Fabric_CA_Client(CA_IP, null , '', crypto_suite);
        var user_from_store = await fabric_client.getUserContext(admin, true);
        
        if(user_from_store && user_from_store.isEnrolled()){
            admin_user = user_from_store;
        }else {
            throw new Error('Failed to get admin...');
        }

        var secret = await fabric_ca_client.register({enrollmentID: user, affiliation: affiliation, role: 'client'}, admin_user);
        
        return {secret : secret};
    }catch(err){
        console.log(err);
    }
}
enrollAdmin();
module.exports = {
    enrollAdmin : enrollAdmin,
    registerUser : registerUser
};