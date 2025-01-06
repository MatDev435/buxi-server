import { Encrypter } from '../../../src/repositories/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
