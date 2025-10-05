#!/usr/bin/env node
require("dotenv").config();

async function checkSpotifyScopes() {
  console.log("Checking Spotify API scopes...");

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!client_id || !client_secret || !refresh_token) {
    console.error("Missing Spotify credentials in environment variables");
    return;
  }

  try {
    console.log("Getting access token...");
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64",
    );

    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }).toString(),
      },
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Failed to get access token");
      console.error("Status:", tokenResponse.status);
      console.error("Response:", tokenData);
      return;
    }

    console.log("✅ Access token obtained");

    // Get current user profile to check permissions
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    console.log("User profile status:", userResponse.status);

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log("User ID:", userData.id);
      console.log("User Email:", userData.email);
      console.log("User Country:", userData.country);
      console.log("User Product:", userData.product);

      // Unfortunately, Spotify API doesn't provide direct access to scopes
      // We'll test each endpoint that requires different scopes

      console.log("\nTesting endpoints with different scope requirements:");

      const endpoints = [
        {
          name: "Currently Playing",
          url: "https://api.spotify.com/v1/me/player/currently-playing",
          scope: "user-read-currently-playing",
        },
        {
          name: "Recently Played",
          url: "https://api.spotify.com/v1/me/player/recently-played",
          scope: "user-read-recently-played",
        },
        {
          name: "Top Tracks",
          url: "https://api.spotify.com/v1/me/top/tracks?limit=1",
          scope: "user-top-read",
        },
        {
          name: "Top Artists",
          url: "https://api.spotify.com/v1/me/top/artists?limit=1",
          scope: "user-top-read",
        },
        {
          name: "User Playlists",
          url: "https://api.spotify.com/v1/me/playlists?limit=1",
          scope: "playlist-read-private",
        },
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint.url, {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        console.log(`\n${endpoint.name} (requires "${endpoint.scope}"):`);
        console.log(
          `Status: ${response.status} (${response.status === 200 ? "✓" : response.status === 204 ? "✓ (No Content)" : "✗"})`,
        );

        if (response.status === 403) {
          console.log(`Missing required scope: ${endpoint.scope}`);
        }
      }

      console.log("\nRecommendation:");
      console.log(
        "If any endpoints returned 403, you may need to regenerate your token with additional scopes.",
      );
      console.log(
        "Run: node scripts/generate-spotify-token.js to generate a new token with all necessary scopes.",
      );
    } else {
      console.error("Failed to get user profile");
    }
  } catch (error) {
    console.error("Error testing Spotify API:", error);
  }
}

checkSpotifyScopes();
