export interface Encrypter {
  hash(plain: string): Promise<string>
  compare(plain: string, hash: string): Promise<boolean>
}
