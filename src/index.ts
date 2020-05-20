import Keyring from '@polkadot/keyring';
import { mnemonicGenerate, mnemonicToSeed, mnemonicValidate } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { waitReady } from '@polkadot/wasm-crypto';

export class Crypto {

  static sessionTypes = [
      'session_grandpa',
      'session_babe',
      'session_imonline',
      'session_parachain',
      'session_audi'
    ];
  static keyTypes = [
      'stash',
      'controller'
    ].concat(Crypto.sessionTypes);


  constructor(private readonly nodes: number){}

  async createKeys(): Promise<object> {
    const output = {};
    const keyTypes = Crypto.keyTypes;
    keyTypes.forEach((type) => {
      output[type] = [];
    });
    const keyringEd = new Keyring({ type: 'ed25519' });
    const keyringSr = new Keyring({ type: 'sr25519' });

    await waitReady();

    for (let counter = 0; counter < this.nodes; counter++) {
      keyTypes.forEach((type) => {
        const { seedU8a, seed, mnemonic } = this.generateSeed();

        let keyring: Keyring;
        if (type === 'session_grandpa') {
          keyring = keyringEd;
        } else {
          keyring = keyringSr;
        }

        const pair = keyring.addFromSeed(seedU8a);
        const address = pair.address;
        output[type].push({ address, seed, mnemonic });
      });
    }
    return output;
  }

  environmentKeys(prefix = 'POLKADOT_DEPLOYER_KEYS'): object {
    const output = {};
    const keyTypes = Crypto.keyTypes;
    keyTypes.forEach((type) => {
      output[type] = [];
    });

    for (let counter = 0; counter < this.nodes; counter++) {

      const envVarPrefix = `${prefix}_${counter}`;
      keyTypes.forEach((type) => {
        const prefix = `${envVarPrefix}_${type.toUpperCase()}`;

        const address = process.env[`${prefix}_ADDRESS`];
        const seed = process.env[`${prefix}_SEED`];

        output[type].push({ address, seed });
      });
    }
    return output;
  }

  private generateSeed(): { seed: string; seedU8a: Uint8Array; mnemonic: string } {
    const mnemonic = this.generateValidMnemonic();

    const seedU8a = mnemonicToSeed(mnemonic);
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
