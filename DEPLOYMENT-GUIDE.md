# 🚀 Aroma Perfume - Complete Deployment Guide

Deploy your full-stack perfume ecommerce application to production.

## 📋 Deployment Overview
- **Backend**: Node.js Express API → **Render**
- **Frontend**: Next.js 15 Application → **Vercel**
- **Database**: MongoDB Atlas (Cloud)

---

## 🗄️ STEP 1: Set Up MongoDB Atlas Database

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier is sufficient)

### 1.2 Configure Database Access
1. **Database Access** → Add new user:
   - Username: `aroma-admin`
   - Password: Generate secure password
   - Role: `Read and write to any database`

2. **Network Access** → Add IP Address:
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)

### 1.3 Get Connection String
1. Go to **Clusters** → Click "Connect"
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://aroma-admin:<password>@cluster0.xxxxx.mongodb.net/aroma-perfume
   ```
4. Replace `<password>` with your actual password

---

## 🔧 STEP 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect `skdas20/Aroma` repository
3. Configure service:
   - **Name**: `aroma-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `18` or `20`

### 2.3 Set Environment Variables in Render
In Render dashboard → Environment tab, add these variables:

```bash
# Database
MONGODB_URI=mongodb+srv://aroma-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aroma-perfume

# Server Configuration
PORT=10000
NODE_ENV=production

# JWT Secret (generate new secure key)
JWT_SECRET=your-super-secure-jwt-secret-for-production

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Gemini AI API
GEMINI_API_KEY=your-actual-gemini-api-key

# CORS Configuration
FRONTEND_URL=https://your-vercel-app-url.vercel.app
```

### 2.4 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend URL: `https://aroma-backend.onrender.com`

---

## 🌐 STEP 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### 3.2 Import Project
1. Click "New Project"
2. Import `skdas20/Aroma` repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3.3 Set Environment Variables in Vercel
In Vercel dashboard → Settings → Environment Variables:

```bash
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx

# Backend API URL
NEXT_PUBLIC_API_URL=https://aroma-backend.onrender.com/api

# Environment
NODE_ENV=production
```

### 3.4 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment (3-5 minutes)
3. Your app will be live at: `https://your-app-name.vercel.app`

---

## 🔥 STEP 4: Configure Firebase Authentication

### 4.1 Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. **Authentication** → **Sign-in method**:
   - Enable "Google" provider
   - Add your Vercel domain to authorized domains

### 4.2 Get Firebase Configuration
1. **Project Settings** → **General** → "Your apps"
2. Add web app and copy config for environment variables

### 4.3 Service Account (Backend)
1. **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Download JSON and extract values for Render

---

## 🧪 STEP 5: Test Your Deployment

### 5.1 Test Backend API
```bash
# Test health endpoint
curl https://aroma-backend.onrender.com/api/health

# Test products endpoint
curl https://aroma-backend.onrender.com/api/products
```

### 5.2 Test Frontend
Visit your Vercel URL and verify:
-  Home page loads with animations
-  Product catalog displays
-  Google authentication works
-  Cart functionality
-  AI chatbot responds
-  3D perfume models load

---

## 🔄 STEP 6: Configure CORS for Production

Update your backend to allow your Vercel domain. In your backend code:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app-name.vercel.app'
  ]
}));
```

---

## 📱 Final Production URLs

After successful deployment:

### Live Application:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://aroma-backend.onrender.com`

### API Endpoints:
- Products: `GET /api/products`
- Authentication: `POST /api/auth/login`
- Cart: `GET/POST /api/cart`
- Chatbot: `POST /api/chatbot`

---

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**: 
   - Check Node.js version (use 18 or 20)
   - Verify all dependencies in package.json

2. **API Errors**: 
   - Verify environment variables are set correctly
   - Check Render logs for backend issues

3. **CORS Issues**: 
   - Update backend CORS to include Vercel URL
   - Redeploy backend after CORS changes

4. **Database Connection**: 
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format

5. **Firebase Auth**: 
   - Add Vercel domain to Firebase authorized domains
   - Check Firebase configuration keys

### Check Logs:
- **Render**: Dashboard → Logs tab
- **Vercel**: Dashboard → Functions → View function logs

---

## 🔒 Security Checklist

- [ ] `.env` files are ignored by Git
- [ ] Production environment variables set
- [ ] Different API keys for dev vs production
- [ ] MongoDB Atlas IP restrictions configured
- [ ] Firebase authorized domains updated
- [ ] HTTPS enabled (automatic on both platforms)

---

##  Deployment Success Checklist

- [ ] MongoDB Atlas database created and accessible
- [ ] Backend deployed to Render with all environment variables
- [ ] Frontend deployed to Vercel with Firebase config
- [ ] Google authentication working
- [ ] API endpoints responding correctly
- [ ] Static assets (images, 3D models) loading
- [ ] AI chatbot functional
- [ ] Cart and checkout flow working
- [ ] Mobile responsive design working

Your Aroma Perfume ecommerce application is now live! 🚀

## 📞 Support

If you encounter issues:
1. Check platform-specific logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors

---

*Happy deploying! Your luxury perfume store is ready to serve customers worldwide.* ✨
