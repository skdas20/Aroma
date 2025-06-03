# Aroma Perfume - Deployment Guide

## 🚀 Environment Variables Setup

### Development (Local)
1. Copy `.env.example` to `.env` in the backend folder
2. Fill in your actual API keys and database connections
3. The `.env` file is automatically ignored by Git for security

### Production Deployment

#### Vercel (Recommended for Next.js Frontend)
1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. In Project Settings → Environment Variables, add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aroma-perfume
   JWT_SECRET=your-actual-jwt-secret-key
   GEMINI_API_KEY=your-actual-gemini-api-key
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

#### Railway/Render (For Backend API)
1. Connect your GitHub repository
2. Set environment variables in the dashboard:
   - All the same variables as above
   - Set `NODE_ENV=production`
   - Set `PORT=` (usually auto-detected)

#### MongoDB Atlas (Database)
1. Create a free cluster at [mongodb.com](https://mongodb.com)
2. Get your connection string
3. Use it as your `MONGODB_URI` in production

#### Firebase (Authentication)
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project and enable Authentication
3. Get your config keys for environment variables

#### Google AI Studio (Gemini API)
1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Generate an API key
3. Use it as your `GEMINI_API_KEY`

## 🔒 Security Notes
- Never commit `.env` files to Git
- Use different API keys for development vs production
- Rotate secrets regularly
- Use environment-specific database connections

## 📝 Quick Setup Commands
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your actual values
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

## 🌐 Production URLs
- Frontend: Deploy to Vercel (auto-detects Next.js)
- Backend: Deploy to Railway/Render
- Database: MongoDB Atlas
- Connect them via environment variables
