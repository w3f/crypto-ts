
import { should } from 'chai';
import { Crypto } from '../src/';

should();

describe('crypto', () => {
    it('Test crypto', () => {
              //((): void => { logger.info('hello world') }).should.not.throw();
              const test = new Crypto(3, "grandpa");
              //console.log(JSON.stringify(test, null, 4));
              console.log(test);
    });
});
