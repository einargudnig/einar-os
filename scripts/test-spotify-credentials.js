#!/usr/bin/env node
require("dotenv").config();
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

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

      // Test that we can get currently playing
      console.log("\nTesting currently playing API...");
      const playerResponse = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      );

      if (playerResponse.status === 204) {
        console.log(
          "Nothing currently playing (status 204) - this is normal if you're not playing anything.",
        );
      } else if (playerResponse.ok) {
        console.log("Successfully connected to currently playing API!");
      } else {
        console.log(`Player API response status: ${playerResponse.status}`);
        console.log(
          "Could not get currently playing information, but auth is working.",
        );
      }
    } else {
      console.error("\nError! ❌ Failed to get access token.");
      console.error(`Status: ${response.status}`);
      console.error("Error details:", data.error);
      console.error("Error description:", data.error_description);
      console.log("\nYou likely need to generate a new refresh token.");
    }
  } catch (error) {
    console.error("\nError during API request:", error);
  }
}

testSpotifyCredentials();
