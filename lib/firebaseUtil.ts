import { credential } from 'firebase-admin';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const serviceAccount = require('/serviceAccountKey.json');

const apps = getApps();
const app =
  apps.length > 0
    ? apps[0]
    : initializeApp(
        {
          credential: credential.cert(serviceAccount),
        },
        serviceAccount.project_id
      );

const db = getFirestore(app);

const getUser = async (email: string) => {
  if (!email) return null;
  const snapshot = await db
    .collection('users')
    .where('email', '==', email)
    .get();
  if (snapshot.size > 0) {
    return snapshot.docs[0].data();
  }
  return null;
};

export { app, db, getUser };
