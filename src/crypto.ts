import Keyring from '@polkadot/keyring';
import { mnemonicGenerate, mnemonicValidate, mnemonicToMiniSecret } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { waitReady } from '@polkadot/wasm-crypto';

import { KeyTypes, KeysBundle } from './types';


export class Crypto {
    constructor(private readonly nodes: number) { }

    async createKeys(): Promise<KeysBundle> {
        const output = {};
        for (const keyType in KeyTypes) {
            output[KeyTypes[keyType]] = [];
        }
        const keyringEd = new Keyring({ type: 'ed25519' });
        const keyringSr = new Keyring({ type: 'sr25519' });

        await waitReady();

        for (let counter = 0; counter < this.nodes; counter++) {
            for (const keyType in KeyTypes) {
                const { seedU8a, seed, mnemonic } = this.generateSeed();

                let keyring: Keyring;
                if (KeyTypes[keyType] === KeyTypes.Grandpa) {
                    keyring = keyringEd;
                } else {
                    keyring = keyringSr;
                }

                const pair = keyring.addFromSeed(seedU8a);
                const address = pair.address;
                output[KeyTypes[keyType]].push({ address, seed, mnemonic });
            }
        }
        return output as KeysBundle;
    }

    environmentKeys(prefix = 'POLKADOT_DEPLOYER_KEYS'): object {
        const output = {};
        for (const keyType in KeyTypes) {
            output[keyType] = [];
        }

        for (let counter = 0; counter < this.nodes; counter++) {

            const envVarPrefix = `${prefix}_${counter}`;
            for (const keyType in KeyTypes) {
                const prefix = `${envVarPrefix}_${keyType.toUpperCase()}`;

                const address = process.env[`${prefix}_ADDRESS`];
                const seed = process.env[`${prefix}_SEED`];

                output[KeyTypes[keyType]].push({ address, seed });
            }
        }
        return output;
    }

    private generateSeed(): { seed: string; seedU8a: Uint8Array; mnemonic: string } {
        const mnemonic = this.generateValidMnemonic();

        const seedU8a = mnemonicToMiniSecret(mnemonic);
        const seed = u8aToHex(seedU8a);

        return { seed, seedU8a, mnemonic };
    }

    private generateValidMnemonic(): string {
        const maxCount = 3;
        let count = 0;
        let isValidMnemonic = false;
        let mnemonic: string;

        while (!isValidMnemonic) {
            if (count > maxCount) {
                throw new Error('could not generate valid mnemonic!');
            }
            mnemonic = mnemonicGenerate();
            isValidMnemonic = mnemonicValidate(mnemonic);
            count++;
        }
        return mnemonic;
    }

}
