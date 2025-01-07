import { compare, hash } from 'bcryptjs'
import { Encrypter } from './encrypter'

export class BcryptEncrypter implements Encrypter {
  private HASH_SALT = 8

  async hash(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash)
  }
}
