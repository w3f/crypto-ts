export interface Key {
    address: string;
    seed: string;
    mnemonic: string;
}

export enum KeyTypes {
    Grandpa = 'session_grandpa',
    Babe = 'session_babe',
    Imonline = 'session_imonline',
    Parachain = 'session_parachain',
    Audi = 'session_audi',
    Stash = 'stash',
    Controller = 'controller'
}

export type KeysBundle = {
    [key in KeyTypes]?: Array<Key>
}
