## Overview

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This repo containing the following packages: `next` `next-auth` `firebase` `@mui/material` `mongodb` `googleapis`

## Setup

1. Run install packages

```bash
npm install
# or
yarn
```

2. Create file .env.local at root path

```javascript
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/admin
DB_NAME=your-db-name
GOOGLE_ID=xxx.apps.googleusercontent.com
GOOGLE_SECRET=xxx
FIREBASE_API_KEY=xxx
FIREBASE_AUTH_DOMAIN=nextjs-tutorial-xxx.firebaseapp.com
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=nextjs-tutorial-xxx
FIREBASE_STORAGE_BUCKET=nextjs-tutorial-xxx.appspot.com
FIREBASE_MESSEAGING_ID=123
FIREBASE_APP_ID=xxx
FIREBASE_MEASURMENT_ID=
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account", ...}
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET=your-random-text
BASE_URL=http://localhost:3000
```

3. Create file /config/dev.js

```javascript
import { ConfigType } from 'types';
import { ServiceAccount } from 'types/auth';
import serviceAccountKey from '../serviceAccountKey.json';

const keys: ConfigType = Object.freeze({
  NODE_ENV: 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/admin',
  DB_NAME: process.env.DB_NAME || 'your-db-name',
  GOOGLE_ID: process.env.GOOGLE_ID || '',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/spreadsheet/callback',
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSEAGING_ID: process.env.FIREBASE_MESSEAGING_ID || '',
  FIREBASE_SERVICE_ACCOUNT_KEY: serviceAccountKey as ServiceAccount,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  PUBLIC_PATHS: ['/auth/signin', '/unauthorized', '/privacyPolicy', '/termOfService'],
});
export default keys;
```

### Firebase setup

#### 1. Create Firebase project

You can following this tutorial for more clearify

[NextAuthJs-V4 | Next Authentication With Firebase | ServerSide Rendering (Google Auth Provider)](https://www.youtube.com/watch?v=so9JJ0YFB-s)

1. Go to [Firebase console](https://console.firebase.google.com)
2. Click Add Project
3. Enter project name `nextjs-tutorial`
4. Disable Google Analytics for this project
5. Click Create project
6. When it’s ready click Continue

#### 2. Setup Firestore database

1. Go to menu Build -> Firebase Database
2. Click Create database
3. Select Start in production mode
4. Select Cloud Firestore location
5. Click Enable
6. Go to tab Rules
7. Change `allow read, write: if false;` to `allow read, write: if true;`
8. Click Publish

#### 3. Setup Firebase project

1. Go to Firebase Project settings
2. Under section Your apps -> Click web icon
3. App nickname = `your-project-name`
4. Click Register app
5. Copy firebaseConfig = `{apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId}`
6. Click Continue to console

#### 4. Setup Google Authentication

1. Go to menu Build -> Authentication
2. Click Get started
3. Go to tab Sign-in method Click Google -> Enable
4. Project public-facing name = `nextjs-tutorial-auth`
5. Click Save button
6. Click Edit on `Google` record
7. Expand Web SDK configuration
8. Copy `Web client ID` and `Web client secret`
9. Hover mouse at `?` after Web SDK configuration
10. Click link Google API Console
11. Under OAuth 2.0 Client IDs click `Web client (auto created by Google Service)`
12. Add following URL to `Authorized JavaScript origins`

- http://localhost:3000

13. Add following URLs to `Authorized redirect URIs`

- http://localhost:3000/api/auth/callback/google
- http://localhost:3000/auth/spreadsheet/callback

14. Click SAVE

#### 5. Get serviceAccountKey.json

1. Go to Firebase project settings > Service accounts > Firebase Admin SDK
2. Click Generate new private key
3. Save as `serviceAccountKey.json` in the root project

```json
{
  "type": "service_account",
  "project_id": "nextjs-tutorial-xxx",
  "private_key_id": "xxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxx@nextjs-tutorial-xxx.iam.gserviceaccount.com",
  "client_id": "123",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxx%40nextjs-tutorial-xxx.iam.gserviceaccount.com"
}
```

#### 6. Enable Google Spreadsheet API

1. Go to https://console.cloud.google.com
2. Select your project
3. Go to Library menu
4. Enable `Drive API` & `Google Sheets API`

#### 7. Edit file .env.local

```javascript
...
GOOGLE_ID= <-- paste from 4.8
GOOGLE_SECRET= <-- paste from 4.8
FIREBASE_API_KEY= <-- paste from 3.5
FIREBASE_AUTH_DOMAIN= <-- paste from 3.5
FIREBASE_PROJECT_ID= <-- paste from 3.5
FIREBASE_STORAGE_BUCKET= <-- paste from 3.5
FIREBASE_MESSEAGING_ID= <-- paste from 3.5
FIREBASE_APP_ID= <-- paste from 3.5
FIREBASE_SERVICE_ACCOUNT_KEY= <-- put content from 5.3 serviceAccountKey.json here when deploy production
...
```

## Getting Started

1. Run command

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Go to tab User then Active your user (First active user will be assign as Admin)
