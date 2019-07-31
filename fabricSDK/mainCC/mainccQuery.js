'use strict';
var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

//==========================================
const CHAINCODE_ID = "test26";
const CHANNEL_NAME = "mychannel";
const PEER_IP = "grpc://localhost:7051";
//==========================================

var fabric_client = new Fabric_Client();
var channel = fabric_client.newChannel(CHANNEL_NAME);
var peer = fabric_client.newPeer(PEER_IP);
channel.addPeer(peer);
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');

const getAllMainInfo = async(user) => {
	var result = await query(CHAINCODE_ID, "getAllMainInfo", user, [])
	return result;
}

const getMainInfoByIdentifier = async(user, identifier) => {
	var result = await query(CHAINCODE_ID, "getMainInfoByIdentifier", user, [identifier]);
	return result;
}

const queryMainInfoByName = async(user, name) => {
	var result = await query(CHAINCODE_ID, "queryMainInfoByName", user, [name]);
	return result;
}

const queryMainInfoByPhone = async(user, phone) => {
	var result = await query(CHAINCODE_ID, "queryMainInfoByPhone", user, [phone]);
	return result;
}

const queryMainInfoById = async(user, id) => {
	var result = await query(CHAINCODE_ID, "queryMainInfoById", user, [id]);
	return result;
}

const queryMainInfoByQueryString = async(user, queryString) => {
	var result = await query(CHAINCODE_ID, "queryMainInfoByQueryString", user, [queryString]);
	return result;
}

const getHistoryMainInfo = async(user, identifier) => {
	var result = await query(CHAINCODE_ID, "getHistoryMainInfo", user, [identifier]);
	return result;
}

const query = async(chaincodeId, fcn, user, args = []) => {
	var result = null;
	try{
		var state_store = await Fabric_Client.newDefaultKeyValueStore({path: store_path});
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
		var user_from_store = await fabric_client.getUserContext(user, true);
		if(!(user_from_store && user_from_store.isEnrolled())){
			throw new Error(`Failed to get ${user} from user store`);
		}
		const request = {
			//targets : --- letting this default to the peers assigned to the channel
			chaincodeId,
			fcn,
			args
		};
		var query_responses = await channel.queryByChaincode(request);
		console.log("Query has completed, checking results");
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				throw new Error(`error from query = ${query_responses[0]}`);
			} else {
				result = query_responses[0].toString();
			}
		} else {
			throw new Error("No payloads were returned from query");
		}
	} catch (error) {
		console.error(`Failed to submit transaction: ${error}`);
		return null;
	}
	return result;
}

const getBlockByNumber = async(user, blockNumber) => {
	var state_store = await Fabric_Client.newDefaultKeyValueStore({path: store_path});
	fabric_client.setStateStore(state_store);
	var crypto_suite = Fabric_Client.newCryptoSuite();
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);
	fabric_client.setCryptoSuite(crypto_suite);
	var user_from_store = await fabric_client.getUserContext(user, true);
	if(!(user_from_store && user_from_store.isEnrolled())){
		throw new Error(`Failed to get ${user} from user store`);
	}
	var block = await channel.queryBlock(blockNumber, peer, true, false);
	return block;
}

module.exports = {
	getAllMainInfo,
	getMainInfoByIdentifier,
	queryMainInfoByName,
	queryMainInfoById,
	queryMainInfoByPhone,
	queryMainInfoByQueryString,
	getHistoryMainInfo
}