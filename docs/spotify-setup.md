# Spotify Integration Setup

If you're seeing "Not connected to Spotify," you may need to update your Spotify credentials.

## Regenerate Your Spotify Tokens

Run this script to get new tokens:

```bash
# From the project root directory
node scripts/generate-spotify-token.js
```

This will:
1. Open a browser window for Spotify authorization
2. Ask you to log in to your Spotify account
3. Get a new refresh token and update your .env file

## Required Scopes

For the Spotify integration to work correctly, your token must have these scopes:

- `user-read-currently-playing` - For the Now Playing feature
- `user-top-read` - For top tracks and artists statistics  
- `user-read-recently-played` - For showing recently played songs as fallback

You can check if your token has all required scopes by running:

```bash
node scripts/check-spotify-scopes.js
```

If any required scope is missing, you'll need to regenerate your token.

## Troubleshooting

1. Check that your .env file has these variables:
   ```
   SPOTIFY_CLIENT_ID=your_id_here
   SPOTIFY_CLIENT_SECRET=your_secret_here
   SPOTIFY_REFRESH_TOKEN=your_token_here
   ```

2. If you're having issues in development mode but it works in production, check:
   - Your `.env.local` file has the correct variables
   - Next.js is correctly loading environment variables
   - Restart the development server after making changes

3. Run the diagnostic scripts:
   ```bash
   # Test direct API access
   node scripts/debug-spotify-api.js
   
   # Check if your token has all required scopes
   node scripts/check-spotify-scopes.js
   ```

4. Common issues:
   - "Not connected to Spotify" - Check your environment variables and token
   - Missing recently played songs - Your token needs the `user-read-recently-played` scope
   - No top tracks/artists - Your token needs the `user-top-read` scope
   
5. Always restart your development server after updating tokens or environment variables.