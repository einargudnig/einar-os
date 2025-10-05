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

## Troubleshooting

1. Make sure you have the required scopes enabled:
   - user-read-currently-playing
   - user-top-read
   - user-read-recently-played

2. Check that your .env file has these variables:
   ```
   SPOTIFY_CLIENT_ID=your_id_here
   SPOTIFY_CLIENT_SECRET=your_secret_here
   SPOTIFY_REFRESH_TOKEN=your_token_here
   ```

3. If the issue persists, run this diagnostic script:
   ```bash
   node scripts/debug-spotify-api.js
   ```

4. Restart your development server after updating tokens.