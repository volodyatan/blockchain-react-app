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

router.put('/', async function(req, res, next) {

  const userID = req.body.id
  const id = req.body.plates
  const make = req.body.make
  const color = req.body.color
  const size = req.body.size
  const price = req.body.price

	try {
	  const userID = req.body.id;
	  const ccp = buildCCPOrg1();
	  const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
	  const wallet = await buildWallet(Wallets, walletPath);
	  const gateway = new Gateway();

			try {
	      await gateway.connect(ccp, {
	        wallet,
	        identity: userID,
	        discovery: { enabled: true, asLocalhost: true }
	      });

	      const network = await gateway.getNetwork(channelName);
	      const contract = network.getContract(chaincodeName);

	      console.log('Calling CreateCar...');
	      result = await contract.submitTransaction('CreateCar', id, color, size, userID, price, make);
	      console.log('Car created');
	      if (`${result}` !== '') {
	        console.log(`New car: ${prettyJSONString(result.toString())}`);
	      }

				res.send('car registered')
	  } finally {
	    gateway.disconnect();
	  }

	} catch (error) {
	  res.send(`error occurred: ${error}`);
	}

});

module.exports = router;
