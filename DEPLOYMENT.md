# Deployment Guide for Render

## 🚀 Quick Setup

### 1. Auth0 Configuration

1. **Login to Auth0 Dashboard**: Go to [Auth0 Dashboard](https://manage.auth0.com/)

2. **Update Application Settings**:
   - Go to Applications → Your App → Settings
   - Add your Render URL to **Allowed Callback URLs**:
     ```
     https://querycraft-ai890.onrender.com,
     http://localhost:3000
     ```
   - Add your Render URL to **Allowed Logout URLs**:
     ```
     https://querycraft-ai890.onrender.com,
     http://localhost:3000
     ```
   - Add your Render URL to **Allowed Web Origins**:
     ```
     https://querycraft-ai890.onrender.com,
     http://localhost:3000
     ```

3. **Save Changes** in Auth0 Dashboard

### 2. Environment Variables on Render

1. **Go to Render Dashboard**: Navigate to your service settings

2. **Add Environment Variables**:
   ```
   REACT_APP_AUTH0_DOMAIN=dev-bvu4qxnb3kxijdfg.us.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=LHDNebXVt5izd5oC61935KbKD9uXNYI2
   REACT_APP_GEMINI_API_KEY=your_actual_gemini_api_key_here
   NODE_ENV=production
   ```

3. **Get Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy and paste it as `REACT_APP_GEMINI_API_KEY`

### 3. Redeploy

After updating Auth0 settings and environment variables:
1. Trigger a new deployment on Render
2. Wait for the build to complete
3. Test the authentication and API functionality

## 🔧 Troubleshooting

### Authentication Issues
- **Problem**: Login redirects to localhost
- **Solution**: Ensure Auth0 callback URLs include your Render domain

### API Key Issues
- **Problem**: "API key required" message
- **Solution**: Set `REACT_APP_GEMINI_API_KEY` environment variable on Render

### CORS Issues
- **Problem**: Auth0 login fails with CORS error
- **Solution**: Add your domain to Auth0 Allowed Web Origins

## 📋 Checklist

- [ ] Auth0 Callback URLs updated with Render domain
- [ ] Auth0 Logout URLs updated with Render domain  
- [ ] Auth0 Web Origins updated with Render domain
- [ ] Environment variables set on Render
- [ ] Gemini API key obtained and configured
- [ ] Service redeployed after configuration changes

## 🌐 Production URLs

- **Production**: https://querycraft-ai890.onrender.com
- **Auth0 Domain**: dev-bvu4qxnb3kxijdfg.us.auth0.com

## 📞 Support

If you continue to have issues:
1. Check Render logs for specific error messages
2. Verify Auth0 configuration matches exactly
3. Ensure all environment variables are set correctly
4. Test locally with production environment variables