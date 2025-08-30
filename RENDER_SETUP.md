# 🚀 Render Deployment Setup Guide

## Step 1: Set Environment Variables on Render

1. **Go to your Render Dashboard**: https://dashboard.render.com
2. **Navigate to your service**: querycraft-ai890
3. **Go to Environment tab**
4. **Add these environment variables**:

```
REACT_APP_AUTH0_DOMAIN=dev-bvu4qxnb3kxijdfg.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=LHDNebXVt5izd5oC61935KbKD9uXNYI2
REACT_APP_GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE
NODE_ENV=production
```

## Step 2: Get Your Gemini API Key

1. **Visit Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Create a new API key**
3. **Copy the API key**
4. **Paste it as the value for `REACT_APP_GEMINI_API_KEY` in Render**

## Step 3: Update Auth0 Configuration

1. **Login to Auth0 Dashboard**: https://manage.auth0.com/
2. **Go to Applications → Your App → Settings**
3. **Update these fields**:

   **Allowed Callback URLs:**
   ```
   https://querycraft-ai890.onrender.com,
   http://localhost:3000
   ```

   **Allowed Logout URLs:**
   ```
   https://querycraft-ai890.onrender.com,
   http://localhost:3000
   ```

   **Allowed Web Origins:**
   ```
   https://querycraft-ai890.onrender.com,
   http://localhost:3000
   ```

4. **Save Changes**

## Step 4: Redeploy

1. **Trigger a new deployment** on Render (this will happen automatically when you update environment variables)
2. **Wait for the build to complete**
3. **Test your application**

## ✅ Expected Results

After completing these steps:
- ✅ Users won't see the API key input (it will be automatically loaded from environment)
- ✅ Auth0 login will work properly
- ✅ The application will function without requiring manual API key entry

## 🔍 Troubleshooting

If you still have issues:

1. **Check Render Logs**: Look for any error messages in the deployment logs
2. **Verify Environment Variables**: Make sure all variables are set correctly
3. **Test Auth0**: Try logging in and check for any CORS errors in browser console
4. **API Key Test**: Check browser console for API key loading messages

## 📞 Need Help?

If you're still having issues after following these steps, check:
- Render environment variables are saved correctly
- Auth0 URLs match exactly (including https://)
- Gemini API key is valid and has proper permissions