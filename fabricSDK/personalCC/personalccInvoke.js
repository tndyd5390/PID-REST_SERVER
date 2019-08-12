'use strict';
const Fabric_Client = require('fabric-client');
const path = require('path');
const util = require('util');
const os = require('os');
const utils = require("../utils");
const {
	nvl,
	strIsEmpty
} = utils

//=========================================================
const CHAINCODE_ID = "test1";
const CHANNEL_NAME = "mychannel";
const PEER_IP = "grpc://localhost:7051";
const ORDERER_IP = "grpc://localhost:7050";
const STORE_PATH = path.join(__dirname, "../hfc-key-store");
//=========================================================



const checkPersonalInfoNvl = personalInfoObj => {
    personalInfoObj.identifier = nvl(personalInfoObj.identifier);
    personalInfoObj.registrationNumber = nvl(personalInfoObj.registrationNumber);
    personalInfoObj.address = nvl(personalInfoObj.address);
    personalInfoObj.email = nvl(personalInfoObj.email);
    personalInfoObj.password = nvl(personalInfoObj.password);
    personalInfoObj.logs = nvl(personalInfoObj.logs);
    return personalInfoObj;
}

const createPersonalInfo = async (user, personalInfoObj) => {
	personalInfoObj = checkPersonalInfoNvl(personalInfoObj);
    if (
        strIsEmpty(personalInfoObj.registrationNumber) ||
        strIsEmpty(personalInfoObj.address) ||
        strIsEmpty(personalInfoObj.email) ||
		strIsEmpty(personalInfoObj.password) || 
		strIsEmpty(personalInfoObj.logs)
    ){
        return false;
    }

    var result = await invoke(
        CHAINCODE_ID,
        "createPersonalInfo",
        CHANNEL_NAME,
        user,
        [
            personalInfoObj.identifier,
            personalInfoObj.registrationNumber,
            personalInfoObj.address,
            personalInfoObj.email,
            personalInfoObj.password,
            personalInfoObj.logs
        ]
    );
    return result;
}

const modificatePersonalInfo = async(user, personalInfoObj) => {
    personalInfoObj = checkPersonalInfoNvl(personalInfoObj);
    var result = await invoke(
        CHAINCODE_ID,
        "updatePersonalInfo",
        CHANNEL_NAME,
        user,
        [
            personalInfoObj.identifier,
            personalInfoObj.registrationNumber,
            personalInfoObj.address,
            personalInfoObj.email,
            personalInfoObj.password,
            personalInfoObj.logs
        ]
    );
    return result;
}

const deletePersonalInfo = async(user, personalInfoObj) => {
	personalInfoObj = checkPersonalInfoNvl(personalInfoObj);
	if(
		strIsEmpty(personalInfoObj.identifier) || 
		strIsEmpty(personalInfoObj.logs)
	) return false;

    var result = await invoke(
		CHAINCODE_ID, 
		"deletePersonalInfo", 
		CHANNEL_NAME, 
		user, 
		[
			personalInfoObj.identifier,
			personalInfoObj.logs
		]
	);
    return result;
}

const main = async() => {
    var result = await createPersonalInfo(
        "user1", 
        {
			identifier: "identifier1",
			registrationNumber : "930522-1184516",
			address: "home",
			email: "tndyd5390@naver.com",
			password: "tndyd5390@",
			logs: "this is fuck"
		}
    );
    console.log(result);
}
const invoke = async(chaincodeId, fcn, channelId, user, args = []) => {
	var result = false;
	console.log('\n\n --- invoke.js - start');
	try {
		const fabric_client = new Fabric_Client();
		const channel = fabric_client.newChannel(CHANNEL_NAME);
		const peer = fabric_client.newPeer(PEER_IP);
		const orderer = fabric_client.newOrderer(ORDERER_IP)
		const member_user = null;
		const state_store = await Fabric_Client.newDefaultKeyValueStore({ path: STORE_PATH});
		fabric_client.setStateStore(state_store);
		const crypto_suite = Fabric_Client.newCryptoSuite();
		const crypto_store = Fabric_Client.newCryptoKeyStore({path: STORE_PATH});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);

		const user_from_store = await fabric_client.getUserContext(user, true);
		if(!(user_from_store && user_from_store.isEnrolled())){
			throw new Error(`Failed to get ${user_from_store}`);
		}

		const tx_id = fabric_client.newTransactionID();

		const proposal_request = {
			targets: [peer],
			chaincodeId,
			fcn,
			args,
			chainId: channelId,
			txId: tx_id
		};

		const endorsement_results = await channel.sendTransactionProposal(proposal_request);

		const proposalResponses = endorsement_results[0];
		const proposal = endorsement_results[1];

		if (proposalResponses[0] instanceof Error) {
			throw new Error(`Failed to send Proposal. Received an error :: ${proposalResponses[0].toString()}`)
		} else if (proposalResponses[0].response && proposalResponses[0].response.status === 200) {
			console.log(util.format(
				'Successfully sent Proposal and received response: Status - %s',
				proposalResponses[0].response.status));
		} else {
			const error_message = util.format('Invoke chaincode proposal:: %j', proposalResponses[i]);
			throw new Error(error_message);
		}

		const commit_request = {
			orderer: orderer,
			proposalResponses: proposalResponses,
			proposal: proposal
		};

		const transaction_id_string = tx_id.getTransactionID();

		const promises = [];

		const sendPromise = channel.sendTransaction(commit_request);
		promises.push(sendPromise);

		let event_hub = channel.newChannelEventHub(peer);

		let txPromise = new Promise((resolve, reject) => {
			let handle = setTimeout(() => {
				event_hub.unregisterTxEvent(transaction_id_string);
				event_hub.disconnect();
				resolve({event_status : 'TIMEOUT'});
			}, 30000);

			event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
				clearTimeout(handle);

				const return_status = {event_status : code, tx_id : transaction_id_string};
				if (code !== 'VALID') {
					resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
				} else {
					resolve(return_status);
				}
			}, (err) => {
				reject(new Error('There was a problem with the eventhub ::'+err));
			},
				{disconnect: true} //disconnect when complete
			);

			event_hub.connect();
		});

		promises.push(txPromise);

		const results = await Promise.all(promises);

		if (results[0].status === 'SUCCESS') {
			console.log('Successfully sent transaction to the orderer');
		} else {
			const message = util.format('Failed to order the transaction. Error code: %s', results[0].status);
			throw new Error(message);
		}

		if (results[1] instanceof Error) {
			throw new Error(message);
		} else if (results[1].event_status === 'VALID') {
			//최종 결과값
			result = true;
		} else {
			const message = util.format('Transaction failed to be committed to the ledger due to : %s', results[1].event_status)
			throw new Error(message);
		}
	} catch(error) {
		console.log('Unable to invoke ::'+ error.toString());
		return false;
	}
	return result;
};


module.exports = {
	createPersonalInfo,
	modificatePersonalInfo,
	deletePersonalInfo
}