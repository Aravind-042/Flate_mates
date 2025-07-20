# OAuth Setup Guide for Supabase

The OAuth error you're seeing indicates that OAuth providers need to be configured in your Supabase project. Here's how to set them up:

## 🔧 **Supabase Dashboard Configuration**

### **Step 1: Access Authentication Settings**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. You'll see a list of available OAuth providers

### **Step 2: Configure Google OAuth**

#### **A. Create Google OAuth Credentials**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** (or Google Identity API)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set application type to **Web application**
6. Add authorized redirect URIs:
   ```
   https://yotshodiprpprkyonwno.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**

#### **B. Configure in Supabase**
1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. Enter your **Client ID** and **Client Secret**
4. Set redirect URL to: `https://dulcet-capybara-79530f.netlify.app/`
5. Click **Save**

### **Step 3: Configure GitHub OAuth**

#### **A. Create GitHub OAuth App**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name**: FlatMates
   - **Homepage URL**: `https://dulcet-capybara-79530f.netlify.app/`
   - **Authorization callback URL**: `https://yotshodiprpprkyonwno.supabase.co/auth/v1/callback`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**

#### **B. Configure in Supabase**
1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **GitHub** and click **Enable**
3. Enter your **Client ID** and **Client Secret**
4. Set redirect URL to: `https://dulcet-capybara-79530f.netlify.app/`
5. Click **Save**

## 🌐 **Site URL Configuration**

### **Set Site URL in Supabase**
1. Go to **Authentication** → **Settings**
2. Set **Site URL** to: `https://dulcet-capybara-79530f.netlify.app/`
3. Add additional redirect URLs if needed:
   ```
   https://dulcet-capybara-79530f.netlify.app/
   http://localhost:8080/
   ```

## 🔄 **Enable OAuth in Frontend**

Once you've configured the providers in Supabase:

1. Open `src/components/Auth/OAuthButtons.tsx`
2. Change this line:
   ```typescript
   const isOAuthEnabled = false; // Set to true once OAuth is configured
   ```
   to:
   ```typescript
   const isOAuthEnabled = true; // OAuth is now configured!
   ```

## ✅ **Testing OAuth**

### **Development Testing**
1. Make sure your local dev server is running on `http://localhost:8080/`
2. Add `http://localhost:8080/` to your OAuth app redirect URLs
3. Test both Google and GitHub sign-in

### **Production Testing**
1. Deploy your changes
2. Test OAuth on your live site
3. Verify user profiles are created correctly

## 🐛 **Common Issues & Solutions**

### **"Refused to Connect" Error**
- **Cause**: OAuth providers not enabled in Supabase
- **Solution**: Follow the configuration steps above

### **"Invalid Redirect URI" Error**
- **Cause**: Redirect URI mismatch
- **Solution**: Ensure redirect URIs match exactly in both OAuth provider and Supabase

### **"CORS Error"**
- **Cause**: Site URL not configured
- **Solution**: Set correct Site URL in Supabase Authentication settings

### **"Provider Not Found" Error**
- **Cause**: Provider not enabled in Supabase
- **Solution**: Enable the provider in Supabase dashboard

## 📋 **Checklist**

- [ ] Google OAuth app created with correct redirect URI
- [ ] GitHub OAuth app created with correct callback URL
- [ ] Google provider enabled in Supabase with credentials
- [ ] GitHub provider enabled in Supabase with credentials
- [ ] Site URL configured in Supabase
- [ ] `isOAuthEnabled` set to `true` in frontend code
- [ ] OAuth tested on both development and production

## 🔐 **Security Notes**

1. **Never commit OAuth secrets** to version control
2. **Use environment variables** for sensitive data in production
3. **Regularly rotate** OAuth credentials
4. **Monitor OAuth usage** in provider dashboards
5. **Set up proper CORS** policies

Once you complete these steps, OAuth will work seamlessly with your application!