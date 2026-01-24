import { credential } from 'firebase-admin'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import keys from 'config/keys'

const apps = getApps()
const app =
  apps.length > 0
    ? apps[0]
    : initializeApp(
        {
          credential: credential.cert(keys.FIREBASE_SERVICE_ACCOUNT_KEY as any)
        },
        keys.FIREBASE_SERVICE_ACCOUNT_KEY.project_id
      )

const db = getFirestore(app)

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
