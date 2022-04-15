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

  console.log('id is: ', req.body);
  const userID = req.body.id
  const car = req.body.car

	try {
	  const userID = req.body.id;
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

	      let status = car.Status.split(',')
	      let newOwner = status[1]

				// set car status to 'idle'
	      console.log('Calling UpdateCar...');
	      result = await contract.submitTransaction('UpdateCar', car.ID, car.Color, car.Size, car.Owner, car.Price, car.Make, car.OwnerHistory, car.Validated, 'idle');
	      console.log('Car updated');
	      if (`${result}` !== '') {
	        console.log(`updated car: ${prettyJSONString(result.toString())}`);
	      }

	      console.log('Calling TransferCar...');
	      await contract.submitTransaction('TransferCar', car.ID, newOwner);
	      console.log('Car transferred');

	      res.send('Car transferred')
	  } finally {
	    gateway.disconnect();
	  }

	} catch (error) {
	  res.send(`error occurred: ${error}`);
	}

});

module.exports = router;
