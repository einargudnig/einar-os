#!/usr/bin/env node
require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
// No need for open package
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8888;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

// Read existing environment variables
const envPath = path.join(process.cwd(), ".env");
let envContent = {};

// Read existing .env file if it exists
try {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envContent[match[1]] = match[2];
    }
  });
} catch (err) {
  // File doesn't exist or can't be read, that's okay
}

// Get client ID and secret from environment or prompt user
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || process.argv[2];
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || process.argv[3];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log("\nError: Missing Spotify client credentials");
  console.log("\nRun this script with your client ID and secret as arguments:");
  console.log(
    "node generate-spotify-token.js YOUR_CLIENT_ID YOUR_CLIENT_SECRET",
  );
  console.log("\nOr make sure they are set in your .env file as:");
  console.log("SPOTIFY_CLIENT_ID=your_client_id_here");
  console.log("SPOTIFY_CLIENT_SECRET=your_client_secret_here");
  process.exit(1);
}

// Generate a random state for security
const state = crypto.randomBytes(16).toString("hex");

app.get("/", (req, res) => {
  res.send(`
    <h1>Spotify Token Generator</h1>
    <p>Click the button below to authorize this app to get a refresh token.</p>
    <a href="/login" style="display: inline-block; background: #1DB954; color: white; padding: 10px 20px; border-radius: 30px; text-decoration: none; font-weight: bold;">
      Connect with Spotify
    </a>
  `);
});

app.get("/login", (req, res) => {
  const scope =
    "user-read-private user-read-email user-read-currently-playing user-top-read user-read-recently-played";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  const receivedState = req.query.state || null;

  if (receivedState !== state) {
    res.status(400).send("State mismatch error. Try again.");
    return;
  }

  if (code) {
    try {
      // Exchange code for tokens
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        },
        body: new URLSearchParams({
          code: code,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        }).toString(),
      });

      const data = await response.json();

      if (data.refresh_token) {
        // Update .env file with the new refresh token
        envContent["SPOTIFY_CLIENT_ID"] = CLIENT_ID;
        envContent["SPOTIFY_CLIENT_SECRET"] = CLIENT_SECRET;
        envContent["SPOTIFY_REFRESH_TOKEN"] = data.refresh_token;

        const newEnvContent = Object.entries(envContent)
          .map(([key, value]) => `${key}=${value}`)
          .join("\n");

        fs.writeFileSync(envPath, newEnvContent);

        res.send(`
          <h1>Success! ✅</h1>
          <p>Your refresh token has been added to your .env file.</p>
          <p>You can now close this window and restart your app.</p>
          <pre style="background: #f4f4f4; padding: 20px; overflow: auto; word-wrap: break-word;">${data.refresh_token}</pre>
        `);
        console.log(
          "\n✅ Success! Refresh token obtained and saved to .env file.",
        );
        console.log("Please restart your application to use the new token.");

        // Close the server after a successful token retrieval
        setTimeout(() => {
          process.exit(0);
        }, 3000);
      } else {
        res.send(`
          <h1>Error ❌</h1>
          <p>Failed to get refresh token.</p>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `);
        console.error("Token response error:", data);
      }
    } catch (error) {
      res.status(500).send(`Error during token exchange: ${error.message}`);
      console.error("Error:", error);
    }
  } else {
    res.status(400).send("No authorization code provided");
  }
});

app.listen(PORT, () => {
  console.log(`\n🎵 Spotify Token Generator\n`);
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Opening your browser...`);
  console.log(`Please visit: http://localhost:${PORT}`);
});
