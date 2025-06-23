# Firebase Phone Authentication Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or use an existing project
3. Enter project name (e.g., "aroma-perfume-app")
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Phone Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Phone** provider
3. Enable Phone authentication
4. Click **Save**

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on the web app icon `</>` or select existing web app
4. Copy the Firebase configuration object

## Step 4: Update Environment Variables

Replace the placeholder values in `frontend/.env.local` with your actual Firebase config:

```bash
# Firebase Configuration (replace with your actual values)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings**
2. In the **Authorized domains** tab, add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `aroma-perfume.vercel.app`)

## Step 6: Test Phone Authentication

1. Run your development server: `npm run dev`
2. Open the login modal
3. Switch to "Phone" tab
4. Enter a valid phone number
5. Complete the OTP verification

## Important Notes

- **SMS Costs**: Firebase charges for SMS messages. Check the [pricing page](https://firebase.google.com/pricing)
- **Rate Limits**: Firebase has built-in rate limiting for phone auth
- **reCAPTCHA**: Required for web applications to prevent abuse
- **Production Testing**: Test thoroughly with real phone numbers before going live

## Troubleshooting

### Common Errors:

1. **`auth/api-key-not-valid`**: Update your Firebase API key in `.env.local`
2. **`auth/app-not-authorized`**: Add your domain to authorized domains
3. **`auth/too-many-requests`**: Wait and try again, or increase quotas
4. **`auth/invalid-phone-number`**: Use proper E.164 format (+1234567890)

### Testing Phone Numbers:

For development, you can use Firebase's test phone numbers:
1. Go to **Authentication** → **Settings** → **Phone numbers for testing**
2. Add test phone numbers with verification codes
3. These won't send actual SMS but will work for testing

## Security Best Practices

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Restrict your Firebase API key to specific domains
3. **Rate Limiting**: Monitor usage to prevent abuse
4. **User Verification**: Consider additional verification steps for sensitive operations
