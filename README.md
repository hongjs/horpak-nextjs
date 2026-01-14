# Horpak Next.js

A modern business management application built with Next.js for managing banks, branches, and generating detailed reports from Google Spreadsheets.

## Features

- **Authentication & Authorization**
  - Google OAuth integration via NextAuth.js
  - Firebase authentication
  - Role-based access control (Admin/User)
  - Cloudflare Turnstile protection

- **Bank & Branch Management**
  - Create, edit, and manage bank records
  - Branch information management
  - Data validation and error handling

- **Report Generation**
  - Invoice report generation from Google Spreadsheets
  - Summary report with data visualization
  - Print-friendly report layouts
  - Integration with Google Sheets API

- **Data Source Management**
  - Admin panel for data source configuration
  - Google Spreadsheet integration
  - Real-time data synchronization

- **User Interface**
  - Modern Material-UI components
  - Dark mode support
  - Responsive design
  - Interactive data grids

## Tech Stack

- **Framework**: Next.js 16.1.1 (React 19)
- **Authentication**: NextAuth.js with Firebase
- **Database**: MongoDB
- **UI Components**: Material-UI (MUI) v7
- **Styling**: TailwindCSS + Emotion
- **APIs**: Google Sheets API, Google Drive API
- **Testing**: Jest + React Testing Library
- **Language**: TypeScript

## Prerequisites

- Node.js >= 22.0.0
- MongoDB instance
- Firebase project
- Google Cloud Project (for Sheets API)
- Cloudflare Turnstile site key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd horpak-nextjs/app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Configuration

### 1. Environment Variables

Create a `.env.local` file in the `app` directory:

```env
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/admin
DB_NAME=your-db-name
TOKEN_SECRET=YOUR_JWT_SECRET
TOKEN_EXPIRES_IN=7d
TURNSTILE_SECRET=YOUR_TURNSTILE_SECRET
GOOGLE_ID=xxx.apps.googleusercontent.com
GOOGLE_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/spreadsheet/callback
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account", ...}
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET=your-random-text
BASE_URL=http://localhost:3000
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add Project**
3. Enter project name (e.g., `horpak-nextjs`)
4. Disable Google Analytics (optional)
5. Click **Create project**

#### Setup Firestore Database
1. Navigate to **Build → Firestore Database**
2. Click **Create database**
3. Select **Start in production mode**
4. Choose your Cloud Firestore location
5. Click **Enable**
6. Go to **Rules** tab
7. Change `allow read, write: if false;` to `allow read, write: if true;`
8. Click **Publish**

#### Configure Firebase Authentication
1. Go to **Build → Authentication**
2. Click **Get started**
3. Select **Sign-in method** tab
4. Enable **Google** provider
5. Set project public-facing name
6. Click **Save**

#### Get Service Account Key
1. Go to **Project Settings → Service Accounts**
2. Click **Generate new private key**
3. Save as `serviceAccountKey.json` in the project root
4. Copy the content to `FIREBASE_SERVICE_ACCOUNT_KEY` in `.env.local`

### 3. Google Cloud Setup

#### Enable Required APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services → Library**
4. Enable the following APIs:
   - Google Drive API
   - Google Sheets API

#### Configure OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**
2. Configure your consent screen
3. Add test users if needed

#### Setup OAuth Client
1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Add **Authorized JavaScript origins**:
   - `http://localhost:3000`
5. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3000/auth/spreadsheet/callback`
6. Save and copy the **Client ID** and **Client Secret**
7. Update `GOOGLE_ID` and `GOOGLE_SECRET` in `.env.local`

### 4. Configuration File

Create `config/dev.ts`:

```typescript
import { ConfigType } from 'types';
import { ServiceAccount } from 'types/auth';
import serviceAccountKey from '../serviceAccountKey.json';

const keys = Object.freeze({
  NODE_ENV: 'development',
  MONGO_URI: 'mongodb://localhost:27017/admin',
  DB_NAME: 'your-db-name',
  TOKEN_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
  TOKEN_EXPIRES_IN: process.env.JWT_EXPIRE || '7d',
  TURNSTILE_SECRET: process.env.TURNSTILE_SECRET || '',
  GOOGLE_ID: process.env.GOOGLE_ID || '',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
  FIREBASE_SERVICE_ACCOUNT_KEY: serviceAccountKey as ServiceAccount,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  BASE_URL: process.env.BASE_URL,
});

export default keys as ConfigType;
```

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## First-Time Setup

1. Start the application in development mode
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. Sign in with Google
4. Go to the **Users** tab
5. Activate your user (first activated user becomes Admin)

## Project Structure

```
app/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── bank/           # Bank management
│   ├── branch/         # Branch management
│   ├── layout/         # Layout components
│   └── report/         # Report components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── middleware/         # Next.js middleware
├── pages/              # Next.js pages and API routes
│   ├── api/           # API endpoints
│   ├── admin/         # Admin pages
│   ├── auth/          # Authentication pages
│   ├── bank/          # Bank management pages
│   ├── branch/        # Branch management pages
│   └── report/        # Report pages
├── public/             # Static assets
├── reducers/           # State reducers
├── styles/             # Global styles
├── types/              # TypeScript type definitions
├── __tests__/          # Test files
└── config/             # Configuration files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run prettier:fix` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Testing

The project uses Jest and React Testing Library for testing.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Environment-Specific Configuration

- **Development**: Uses `config/dev.ts`
- **Production**: Uses `config/prod.ts` or environment variables

## Security Considerations

1. Never commit `.env` or `.env.local` files
2. Keep `serviceAccountKey.json` secure and out of version control
3. Rotate secrets regularly
4. Use strong values for `TOKEN_SECRET` and `NEXTAUTH_SECRET`
5. Enable Cloudflare Turnstile for additional security

## Docker Support

The project includes Docker configuration:

```bash
# Build image
docker build -t horpak-nextjs .

# Run with docker-compose
docker-compose up
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
