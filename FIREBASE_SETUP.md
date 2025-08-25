# Firebase Authentication Setup Guide

## Current Issue
Your Firebase authentication is not working properly because the `.env` file is missing required configuration values. Currently, only the API key is present.

## Required Environment Variables

You need to add the following variables to your `.env` file:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyCV7VKZIa_HvTt0kpAj3OOPbtIREozXvPQ
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
```

## How to Get These Values

### 1. Go to Firebase Console
- Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Sign in with your Google account

### 2. Select Your Project
- Choose your existing project or create a new one
- If creating new: Click "Create a project" and follow the setup wizard

### 3. Get Configuration Values
- Click the gear icon (⚙️) next to "Project Overview"
- Select "Project settings"
- Scroll down to "Your apps" section
- If you don't have a web app, click "Add app" and choose the web icon (</>)
- Copy the configuration values from the provided config object

### 4. Update Your .env File
Replace the placeholder values in your `.env` file with the actual values from Firebase.

## Enable Authentication Providers

### 1. Enable Email/Password Authentication
- In Firebase Console, go to "Authentication" → "Sign-in method"
- Click on "Email/Password"
- Enable it and click "Save"

### 2. Enable Google Authentication
- In "Sign-in method", click on "Google"
- Enable it
- Add your authorized domain (localhost for development)
- Click "Save"

### 3. Enable GitHub Authentication
- In "Sign-in method", click on "GitHub"
- Enable it
- You'll need to create a GitHub OAuth app first:
  - Go to GitHub → Settings → Developer settings → OAuth Apps
  - Click "New OAuth App"
  - Set Authorization callback URL to: `https://your-project-id.firebaseapp.com/__/auth/handler`
  - Copy the Client ID and Client Secret to Firebase
- Add your authorized domain
- Click "Save"

## Restart Your Development Server

After updating the `.env` file:
```bash
npm start
```

## Testing Authentication

1. **Email/Password**: Should work after enabling in Firebase
2. **Google**: Should work after enabling and adding domain
3. **GitHub**: Should work after setting up OAuth app and enabling

## Common Issues and Solutions

### "Firebase not properly configured"
- Check that all environment variables are set
- Ensure no typos in variable names
- Restart your development server

### "Unauthorized domain"
- Add your domain to Firebase authorized domains
- For development: add `localhost`

### "Popup blocked"
- Allow popups for your domain
- Check browser popup blocker settings

### "GitHub authentication failed"
- Verify GitHub OAuth app is properly configured
- Check callback URL matches Firebase requirements
- Ensure Client ID and Secret are correct

## Security Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use different Firebase projects for development and production
- Regularly rotate your API keys

## Need Help?

If you're still experiencing issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Firebase project is properly configured
4. Check that authentication providers are enabled
