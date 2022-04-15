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

  try {
	  const userID = req.body.id;
	  const ccp = buildCCPOrg1();
	  const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
	  const wallet = await buildWallet(Wallets, walletPath);

	  await registerAndEnrollUser(caClient, wallet, mspOrg1, userID, 'org1.department1');

		res.send('new user registered')
  } catch (error) {
    res.send(`error occurred: ${error}`);
  }

});

module.exports = router;
