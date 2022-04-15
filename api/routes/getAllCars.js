var express = require('express');
var router = express.Router();

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../../RE-Project/fabric-samples/test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../../RE-Project/fabric-samples/test-application/javascript/AppUtil.js');

const channelName = 'channel1';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = './wallet';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

router.get('/', async function(req, res, next) {

	try {
	  const ccp = buildCCPOrg1();
	  const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
	  const wallet = await buildWallet(Wallets, walletPath);
	  const gateway = new Gateway();

	  try {
	      await gateway.connect(ccp, {
	        wallet,
	        identity: 'admin',
	        discovery: { enabled: true, asLocalhost: true }
	      });

	      const network = await gateway.getNetwork(channelName);
	      const contract = network.getContract(chaincodeName);

	      console.log('Calling GetAllCars...');
	      let result = await contract.evaluateTransaction('GetAllCars');
	      console.log(`all cars: ${prettyJSONString(result.toString())}`);

	      res.send(result)

	  } finally {
	    gateway.disconnect();
	  }

	} catch (error) {
	  res.send(`error occurred: ${error}`);
	}

});

module.exports = router;
