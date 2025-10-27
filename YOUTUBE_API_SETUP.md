# YouTube API Setup Instructions

## Current Issue
The YouTube API key in the code is returning **403 Forbidden** errors, which means:
- The API key is invalid, expired, or revoked
- YouTube Data API v3 is not enabled for this key
- Daily quota has been exceeded

## How to Get a Valid YouTube API Key

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

### Step 2: Create or Select a Project
1. Click on the project dropdown at the top
2. Click "New Project" or select an existing project
3. Give it a name like "CineLenz YouTube API"

### Step 3: Enable YouTube Data API v3
1. Go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on it and press "Enable"

### Step 4: Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional but recommended) Click "Restrict Key":
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Under "Application restrictions", you can add your website domain

### Step 5: Update the Code
Replace the API key in these files:

**File 1: `components/social-analysis.tsx`** (line 43)
```typescript
const YOUTUBE_API_KEY = "YOUR_NEW_API_KEY_HERE";
```

**File 2: `components/review-chart.tsx`** (line 16)
```typescript
const YOUTUBE_API_KEY = "YOUR_NEW_API_KEY_HERE"
```

## YouTube API Quota Limits

**Free tier daily quota: 10,000 units**

Cost per operation:
- Search request: 100 units (you're making 1 per movie)
- Comment threads list: 1 unit (you're making up to 10 per movie, plus pagination)

### Current Usage per Movie:
- 1 search = 100 units
- 10 videos × 10 pages of comments = 100 comment requests = 100 units
- **Total: ~200 units per movie**

With 10,000 units daily quota, you can search approximately **50 movies per day** before hitting the limit.

## Alternative: Use Multiple API Keys

If you need more quota, create multiple Google Cloud projects and rotate between API keys:

```typescript
const YOUTUBE_API_KEYS = [
  "AIzaSy...key1",
  "AIzaSy...key2",
  "AIzaSy...key3",
];

// Rotate keys
let keyIndex = 0;
const getYouTubeKey = () => {
  const key = YOUTUBE_API_KEYS[keyIndex];
  keyIndex = (keyIndex + 1) % YOUTUBE_API_KEYS.length;
  return key;
};
```

## Testing Your API Key

Test with this PowerShell command:
```powershell
Invoke-RestMethod -Uri "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=Inception+trailer&key=YOUR_API_KEY_HERE"
```

If successful, you'll see JSON data with video results.

## Current API Key Status
❌ **Current key is NOT working** (403 Forbidden error)

Please follow the steps above to generate a new valid API key.
