import { credential } from 'firebase-admin'
import { initializeApp, getApps, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import keys from 'config/keys'

const apps = getApps()
let app: App | undefined

if (apps.length > 0) {
  app = apps[0]
} else if (keys.FIREBASE_SERVICE_ACCOUNT_KEY) {
  app = initializeApp(
    {
      credential: credential.cert(keys.FIREBASE_SERVICE_ACCOUNT_KEY as any)
    },
    keys.FIREBASE_SERVICE_ACCOUNT_KEY.project_id
  )
}

const db = (app ? getFirestore(app) : {}) as Firestore

const getUser = async (email: string) => {
  if (!email) return null
  const snapshot = await db.collection('users').where('email', '==', email).get()
  if (snapshot.size > 0) {
    return snapshot.docs[0].data()
  }
  return null
}

const checkAdmin = async () => {
  const snapshot = await db.collection('users').where('admin', '==', true).get()

  return snapshot.size === 0
}

export { app, db, getUser, checkAdmin }
