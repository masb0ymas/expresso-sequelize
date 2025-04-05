import argon2 from 'argon2'

export default class Hashing {
  async hash(password: string): Promise<string> {
    return await argon2.hash(password)
  }

  async verify(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password)
  }
}
