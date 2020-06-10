import { should } from 'chai';
import Keyring from "@polkadot/keyring";

import { Crypto } from '../src/crypto';
import { KeyTypes } from '../src/types';

should();

describe('crypto', () => {
    it('Test crypto structure', async () => {
        // Testing result format.

        const nodes = 5;
        const c = new Crypto(nodes);
        const result = await c.createKeys();

        //Object.keys(result).length.should.eq(KeyTypes.length);
        const stash = result[KeyTypes.Stash];
        stash[0].should.have.property('address').and.to.be.a('string');
        stash[0].should.have.property('seed').and.to.be.a('string');
        stash[0].should.have.property('mnemonic').and.to.be.a('string');
        Object.keys(stash).length.should.eq(nodes);
        const controller = result[KeyTypes.Controller];
        Object.keys(controller).length.should.eq(nodes);
        const sessionGrandpa = result[KeyTypes.Grandpa];
        Object.keys(sessionGrandpa).length.should.eq(nodes);
        const sessionBabe = result[KeyTypes.Babe];
        Object.keys(sessionBabe).length.should.eq(nodes);
        const sessionImOnline = result[KeyTypes.Imonline];
        Object.keys(sessionImOnline).length.should.eq(nodes);
        const sessionAudi = result[KeyTypes.Audi];
        Object.keys(sessionAudi).length.should.eq(nodes);
    });

    it('Test keyringEd', async () => {
        const keyring = new Keyring({
            type: "ed25519",
        });
        // Testing if generated keys are valid for grandpa
        const nodes = 1;
        const c = new Crypto(nodes);
        const result = await c.createKeys();

        const sessionGrandpa = result[KeyTypes.Grandpa][0];
        const sessionGrandpaAccount = keyring.createFromUri(sessionGrandpa.seed);
        sessionGrandpaAccount.address.should.eq(sessionGrandpa.address);
    });

    it('Test keyringSr', async () => {
        const keyring = new Keyring({
            type: "sr25519",
        });
        // Testing if generated keys are valid other cases
        const nodes = 1;
        const c = new Crypto(nodes);
        const result = await c.createKeys();

        const controller = result[KeyTypes.Controller][0];
        const controllerAccount = keyring.createFromUri(controller.seed);
        controllerAccount.address.should.eq(controller.address);

        const sessionBabe = result[KeyTypes.Babe][0];
        const sessionBabeAccount = keyring.createFromUri(sessionBabe.seed);
        sessionBabeAccount.address.should.eq(sessionBabe.address);

        const sessionImOnline = result[KeyTypes.Imonline][0];
        const sessionImOnlineAccount = keyring.createFromUri(sessionImOnline.seed);
        sessionImOnlineAccount.address.should.eq(sessionImOnline.address);

        const sessionAudi = result[KeyTypes.Audi][0];
        const sessionAudiAccount = keyring.createFromUri(sessionAudi.seed);
        sessionAudiAccount.address.should.eq(sessionAudi.address);
    });
});
