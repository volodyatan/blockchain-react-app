/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                ID: '123ABC',
                Color: 'blue',
                Size: 4,
                Owner: 'Jonathan',
                Price: 10000,
                Make: 'Subaru',
                OwnerHistory: 'Jonathan',
                Validated: false,
                Status: 'unvalidated'
            }
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
    }

    // CreateCar issues a new car asset to the world state
    async CreateCar(ctx, id, color, size, owner, price, make) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The car asset ${id} already exists`);
        }

        const asset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            Price: price,
            Make: make,
            OwnerHistory: owner,
            Validated: false,
            Status: 'unvalidated'
        };
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    // GetCar returns the car asset stored in the world state given an id (plate number)
    async GetCar(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The car asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateCar updates an existing car asset in the world state with new data
    async UpdateCar(ctx, id, color, size, owner, price, make, ownerHistory, validated, status) {
        const exists = await this.CarExists(ctx, id);
        if (!exists) {
            throw new Error(`The car asset ${id} does not exist`);
        }

        // update old car data with new data
        const updatedAsset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            Price: price,
            Make: make,
            OwnerHistory: ownerHistory,
            Validated: validated,
            Status: status
        };
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteCar deletes a car asset given an id (plate number)
    async DeleteCar(ctx, id) {
        const exists = await this.CarExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // CarExists returns true when asset with id exists, false otherwise
    async CarExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferCar updates the owner field of car asset with new owner, adds new owner to ownerHistory
    async TransferCar(ctx, id, newOwner) {
        const assetString = await this.GetCar(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        // update owner history
        let ownerHistory = asset.OwnerHistory
        ownerHistory = `${newOwner},${ownerHistory}`
        asset.OwnerHistory =  ownerHistory

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldOwner;
    }

    // GetAllCars returns all car assets
    async GetAllCars(ctx) {
        const allCars = [];
        const iterator = await ctx.stub.getStateByRange('','');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let car;
            try {
                car = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                car = strValue;
            }
            allCars.push(car);
            result = await iterator.next();
        }
        return JSON.stringify(allCars);
    }
}

module.exports = AssetTransfer;
