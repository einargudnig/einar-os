# Whoop Data Fetcher

A Bun-based cron job that fetches your Whoop recovery, sleep, and workout data via the Whoop API.

## Setup

### 1. Get Whoop API Credentials

1. Go to [https://developer.whoop.com/](https://developer.whoop.com/)
2. Create a developer account (if you don't have one)
3. Create a new application
4. Note your **Client ID** and **Client Secret**
5. Set the **Redirect URI** to `http://localhost:3000/callback` (or your preferred URI)

### 2. Configure Environment Variables

Add these variables to your `.env` or `.env.local` file:

```bash
WHOOP_CLIENT_ID=your_client_id_here
WHOOP_CLIENT_SECRET=your_client_secret_here
WHOOP_REDIRECT_URI=http://localhost:3000/callback
```

### 3. Authenticate with Whoop

Run the OAuth authentication script to get your initial access and refresh tokens:

```bash
bun run scripts/whoop-oauth.ts
```

This will:
1. Display an authorization URL
2. Open it in your browser and authorize the application
3. Copy the authorization code from the redirect URL
4. Paste it into the terminal
5. Save your tokens to `.whoop-tokens.json`

## Usage

### Run Once

Fetch Whoop data once and exit:

```bash
bun run lib/whoop/cron.ts --once
```

### Run as Cron Job

Run continuously and fetch data every 60 minutes (default):

```bash
bun run lib/whoop/cron.ts
```

### Custom Interval

Run with a custom interval (e.g., every 30 minutes):

```bash
bun run lib/whoop/cron.ts --interval=30
```

### Run in Background

Use a process manager like `pm2` or run in the background:

```bash
# Using nohup
nohup bun run lib/whoop/cron.ts > whoop-cron.log 2>&1 &

# Or add to your crontab
# Runs every hour
0 * * * * cd /path/to/einar-os && bun run lib/whoop/cron.ts --once
```

## Data Storage

Fetched data is saved to `./data/whoop/YYYY-MM-DD.json` with the following structure:

```json
{
  "timestamp": "2026-01-13T12:00:00.000Z",
  "recovery": [...],
  "sleep": [...],
  "workouts": [...]
}
```

## Token Refresh

The client automatically refreshes your access token when it expires using the refresh token. Tokens are stored in `.whoop-tokens.json`.

If you need to re-authenticate, simply run the OAuth script again:

```bash
bun run scripts/whoop-oauth.ts
```

## API Reference

The `WhoopClient` class provides these methods:

- `getRecovery(startDate?, endDate?)` - Fetch recovery data
- `getSleep(startDate?, endDate?)` - Fetch sleep data
- `getWorkouts(startDate?, endDate?)` - Fetch workout data
- `getUserProfile()` - Get user profile information
- `getBodyMeasurement()` - Get body measurements (height, weight, max HR)

## Example: Custom Script

```typescript
import { WhoopClient } from './lib/whoop/client';

const client = new WhoopClient(
  process.env.WHOOP_CLIENT_ID!,
  process.env.WHOOP_CLIENT_SECRET!
);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const recovery = await client.getRecovery(yesterday);
console.log(recovery);
```

## Troubleshooting

**Error: No tokens found**
- Run `bun run scripts/whoop-oauth.ts` to authenticate

**Error: Failed to refresh token**
- Your refresh token may have expired
- Re-authenticate with `bun run scripts/whoop-oauth.ts`

**Error: WHOOP_CLIENT_ID and WHOOP_CLIENT_SECRET must be set**
- Add credentials to your `.env` file

## Security Notes

- Never commit `.whoop-tokens.json` to version control (already in `.gitignore`)
- Keep your Client ID and Client Secret secure
- Tokens are stored locally and refreshed automatically
- Data files in `./data/whoop/` are excluded from git
