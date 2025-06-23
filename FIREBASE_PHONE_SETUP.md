# Firebase Phone Authentication Setup Guide

## Step 1: Enable Phone Authentication in Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `healthpix-63617`
3. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Go to "Sign-in method" tab
4. **Enable Phone Authentication**:
   - Click on "Phone" provider
   - Toggle "Enable" switch
   - Click "Save"

## Step 2: Configure reCAPTCHA (Required for Phone Auth)

### Option A: Invisible reCAPTCHA (Recommended)
- Add your domain to the authorized domains list
- For development: `localhost`
- For production: your actual domain

### Option B: Visible reCAPTCHA
- Users will see a reCAPTCHA checkbox before sending SMS

## Step 3: Test Phone Numbers (Optional for Development)

For testing without using real SMS:

1. In Firebase Console → Authentication → Sign-in method
2. Scroll down to "Phone numbers for testing"
3. Add test phone numbers with verification codes:
   - Phone: `+1 650-555-3434`
   - Code: `123456`

## Current Configuration

```javascript
// Current Firebase Config (in production)
const firebaseConfig = {
  apiKey: "AIzaSyDF3FBk30I4y1UfRvAB0nnOfOfiZnDfhPk",
  authDomain: "healthpix-63617.firebaseapp.com",
  projectId: "healthpix-63617",
  storageBucket: "healthpix-63617.appspot.com",
  messagingSenderId: "275934394685",
  appId: "1:275934394685:web:healthpix63617"
};
```

## Features Implemented

✅ **Phone Number Input**: Country code selection + formatted input
✅ **SMS Verification**: Real SMS via Firebase
✅ **OTP Input**: 6-digit verification code
✅ **reCAPTCHA**: Invisible verification (required by Firebase)
✅ **Error Handling**: Comprehensive error messages
✅ **Resend Logic**: 60-second countdown with resend option
✅ **UI/UX**: Beautiful interface matching luxury theme

## How It Works

1. **User enters phone number** → Select country code + phone input
2. **Firebase sends SMS** → Real SMS with 6-digit code
3. **User enters OTP** → Verification code input
4. **Firebase verifies** → Automatic sign-in on success
5. **User is authenticated** → Same as Google OAuth flow

## Security Features

- **reCAPTCHA protection** against automated attacks
- **Rate limiting** built into Firebase
- **Phone number validation** with proper formatting
- **SMS quota management** by Firebase
- **Fraud detection** included

## Testing Instructions

1. **Development**: Use test phone numbers from Firebase Console
2. **Production**: Use real phone numbers
3. **International**: Works globally with country codes

## Error Handling

- Invalid phone number format
- Too many requests (rate limiting)
- SMS quota exceeded
- Invalid verification code
- Expired verification code
- Network connection issues

## Cost Information

- **SMS Charges**: Small fee per SMS sent
- **Free Tier**: Generous free quota
- **Pay-as-you-go**: Only pay for SMS sent
- **No upfront costs**: Perfect for startups
