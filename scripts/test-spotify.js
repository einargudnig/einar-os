require("dotenv").config();
const fs = require("fs");

async function testSpotifyCredentials() {
  console.log("Checking Spotify credentials...");

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  console.log("Environment variables:");
  console.log(`- SPOTIFY_CLIENT_ID exists: ${!!client_id}`);
  console.log(`- SPOTIFY_CLIENT_SECRET exists: ${!!client_secret}`);
  console.log(`- SPOTIFY_REFRESH_TOKEN exists: ${!!refresh_token}`);

  if (!client_id || !client_secret || !refresh_token) {
    console.error("\nMissing one or more required environment variables!");
    console.log("\nPlease set up your .env file with:");
    console.log("SPOTIFY_CLIENT_ID=your_client_id");
    console.log("SPOTIFY_CLIENT_SECRET=your_client_secret");
    console.log("SPOTIFY_REFRESH_TOKEN=your_refresh_token");
    return;
  }

  try {
    console.log("\nTesting token retrieval...");

    const basic = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64",
    );

    // Try to get a token
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }).toString(),
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      console.log("\nSuccess! ✅ Your Spotify credentials are working.");
      console.log(
        `Access token received: ${data.access_token.substring(0, 5)}...`,
      );
    } else {
      console.error("\nError! ❌ Failed to get access token.");
      console.error(`Status: ${response.status}`);
      console.error("Error details:", data.error);
      console.error("Error description:", data.error_description);
      console.log("\nYou likely need to generate a new refresh token.");
      console.log("See docs/spotify-setup.md for instructions.");
    }
  } catch (error) {
    console.error("\nError during API request:", error);
  }
}

testSpotifyCredentials();
