# Firebase Billing Setup for Phone Authentication

## Why This Error Occurs
Phone Authentication requires Firebase Blaze Plan (Pay-as-you-go) because:
- SMS messages cost money to send
- Firebase needs billing enabled to cover SMS costs
- Free Spark plan doesn't include phone auth

## Solution: Upgrade to Blaze Plan

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com
2. Select your project: `healthpix-63617`

### Step 2: Upgrade Billing Plan
1. Click "Upgrade" in the left sidebar
2. Select "Blaze Plan (Pay as you go)"
3. Add a payment method (credit card)
4. Complete the upgrade

### Step 3: Enable Phone Authentication
1. Go to Authentication > Sign-in method
2. Click "Phone" provider
3. Click "Enable"
4. Save changes

## Cost Information
- **Phone Authentication**: ~$0.05 per SMS
- **Free tier**: 10,000 verifications/month included
- **Very affordable** for testing and small apps

## Alternative: Test Mode (For Development)
Firebase provides test phone numbers for development:
- Test numbers: +1 650-555-3434, +1 555-555-5555
- Test codes: 123456, 654321
- No SMS cost, no billing required

Would you like me to implement test mode for now?
