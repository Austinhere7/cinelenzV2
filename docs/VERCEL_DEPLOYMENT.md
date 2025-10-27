# Vercel Deployment Guide for CineLenz

## Prerequisites
- GitHub account connected to Vercel
- Vercel account (https://vercel.com)
- Repository pushed to GitHub ✅ (completed)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended - Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose: `Austinhere7/cinelenzV2`
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `pnpm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `pnpm install` (auto-detected)

4. **Environment Variables** (Optional but Recommended)
   - Click "Environment Variables"
   - Add if you want to secure API keys:
     ```
     YOUTUBE_KEY_1=AIzaSyDYi_JWoU0qESYkGx3P4XJBwt9GHstn0gA
     YOUTUBE_KEY_2=AIzaSyCaOCYvvg1-NQate26vBYeRvUnJuMaNrnI
     YOUTUBE_KEY_3=AIzaSyDDtrZW4CEJFmjaI9qSvBuTr5ZpU_4T2Yw
     ```
   - Note: Currently keys are hardcoded in the components (working fine)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://cinelenz-v2.vercel.app` (or similar)

### Option 2: Deploy via Vercel CLI (Already Installed)

1. **Login to Vercel**
   ```cmd
   vercel login
   ```

2. **Deploy from Project Directory**
   ```cmd
   cd c:\Users\austi\cinelenz
   vercel
   ```

3. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name? **cinelenz-v2** (or your choice)
   - Directory? **./** (press Enter)
   - Override settings? **No** (press Enter)

4. **Wait for deployment** (2-3 minutes)
   - You'll get a preview URL
   - To deploy to production:
     ```cmd
     vercel --prod
     ```

## Post-Deployment

### Verify Your Deployment

1. **Visit your site**: Check the URL provided by Vercel
2. **Test features:**
   - ✅ Movie search working
   - ✅ Reviews displaying (TMDB, OMDb, YouTube)
   - ✅ Compare functionality
   - ✅ Trending movies

3. **Check Console for API Logs:**
   - Open browser DevTools → Console
   - Search for a movie
   - Look for `[YouTube]` logs to verify API calls

### Custom Domain (Optional)

1. Go to your project on Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `cinelenz.com`)
4. Follow DNS configuration instructions

### Automatic Deployments

✅ **Already configured!** Every `git push` to `main` branch will automatically:
- Trigger a new Vercel deployment
- Build and deploy your changes
- Update your production site

## Environment Variables for Production (Future)

If you want to move API keys to environment variables later:

1. **In Vercel Dashboard:**
   - Project → Settings → Environment Variables
   - Add each key with values

2. **Update code to use env vars:**
   ```typescript
   const YOUTUBE_API_KEYS = [
     process.env.NEXT_PUBLIC_YOUTUBE_KEY_1,
     process.env.NEXT_PUBLIC_YOUTUBE_KEY_2,
     process.env.NEXT_PUBLIC_YOUTUBE_KEY_3,
   ].filter(Boolean);
   ```

## Troubleshooting

### Build Fails
- Check Vercel build logs in dashboard
- Ensure all dependencies are in `package.json`
- Run `pnpm run build` locally first

### API Keys Not Working
- Check browser console for errors
- Verify YouTube Data API v3 is enabled
- Check quota limits in Google Cloud Console

### 404 Errors
- Ensure `app` directory structure is correct
- Check `next.config.mjs` settings

## Performance Monitoring

Vercel provides built-in analytics:
- Visit: Project → Analytics
- Monitor page load times
- Track API response times
- View visitor statistics

## Current Configuration

✅ **Ready to deploy with:**
- 3 YouTube API keys (30k daily quota)
- 50 reviews minimum per movie
- Compare functionality
- WatchlistProvider context
- Synthetic review generation
- Balanced API usage (YouTube reduced 50%)

## Cost

**Vercel Free Tier includes:**
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Global CDN
- Preview deployments

**Your app should stay within free tier unless you get very high traffic.**

## Next Steps

Choose deployment method:
1. **Vercel Dashboard** (easier, recommended): Go to https://vercel.com/new
2. **Vercel CLI** (already installed): Run `vercel` command

Both methods work perfectly. Dashboard is more visual and easier for first-time deployment.
