import * as admin from 'firebase-admin'
import path from 'path'
import fs from 'fs'
import { FIREBASE_DATABASE_URL } from './env'

const serviceAccountKey = path.resolve('./serviceAccountKey.json')

if (!fs.existsSync(serviceAccountKey)) {
  throw new Error(
    'Missing serviceAccountKey!!!\nCopy serviceAccountKey from your console firebase to root directory "serviceAccountKey.json"'
  )
}

console.log(serviceAccountKey)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: FIREBASE_DATABASE_URL,
})

const dbFirestore = admin.firestore()

export { dbFirestore }
