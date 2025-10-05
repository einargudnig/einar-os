#!/usr/bin/env node
require("dotenv").config();

async function testSpotifyAPI() {
  console.log("Testing Spotify API directly...");

  // Display environment variables status
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  console.log("Environment Variables:");
  console.log("- SPOTIFY_CLIENT_ID exists:", !!client_id);
  console.log("- SPOTIFY_CLIENT_SECRET exists:", !!client_secret);
  console.log("- SPOTIFY_REFRESH_TOKEN exists:", !!refresh_token);
  console.log("- NODE_ENV:", process.env.NODE_ENV);

  if (!client_id || !client_secret || !refresh_token) {
    console.error("Missing Spotify credentials in environment variables");
    return;
  }

  try {
    console.log("\nGetting access token...");
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
    console.log("\n--- Testing API Endpoints ---");

    // Test currently playing
    console.log("\n1. CURRENTLY PLAYING:");
    const nowPlayingResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    console.log("Status:", nowPlayingResponse.status);

    if (nowPlayingResponse.status === 204) {
      console.log("No track currently playing");
    } else if (nowPlayingResponse.ok) {
      const nowPlayingData = await nowPlayingResponse.json();
      console.log("Track playing:", nowPlayingData.item?.name);
      console.log(
        "Artist:",
        nowPlayingData.item?.artists.map((a) => a.name).join(", "),
      );
      console.log(
        "Raw response:",
        JSON.stringify(nowPlayingData, null, 2).substring(0, 500) + "...",
      );
    } else {
      console.error("Error fetching currently playing");
    }

    // Test last played
    console.log("\n2. LAST PLAYED:");
    const lastPlayedResponse = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    console.log("Status:", lastPlayedResponse.status);

    if (lastPlayedResponse.ok) {
      const lastPlayedData = await lastPlayedResponse.json();
      if (lastPlayedData.items && lastPlayedData.items.length > 0) {
        const track = lastPlayedData.items[0].track;
        console.log("Last played track:", track.name);
        console.log("Artist:", track.artists.map((a) => a.name).join(", "));
        console.log(
          "Played at:",
          new Date(lastPlayedData.items[0].played_at).toLocaleString(),
        );
        console.log(
          "Raw response:",
          JSON.stringify(lastPlayedData, null, 2).substring(0, 500) + "...",
        );
      } else {
        console.log("No recently played tracks found");
      }
    } else {
      console.error("Error fetching last played:", lastPlayedResponse.status);
    }

    // Test top tracks
    console.log("\n3. TOP TRACKS:");
    const topTracksResponse = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    console.log("Status:", topTracksResponse.status);

    if (topTracksResponse.ok) {
      const topTracksData = await topTracksResponse.json();
      if (topTracksData.items && topTracksData.items.length > 0) {
        console.log("Top tracks:");
        topTracksData.items.forEach((track, i) => {
          console.log(
            `${i + 1}. ${track.name} - ${track.artists.map((a) => a.name).join(", ")}`,
          );
        });
        console.log(
          "Raw response:",
          JSON.stringify(topTracksData, null, 2).substring(0, 500) + "...",
        );
      } else {
        console.log("No top tracks found");
      }
    } else {
      console.error("Error fetching top tracks:", topTracksResponse.status);
    }

    // Test top artists
    console.log("\n4. TOP ARTISTS:");
    const topArtistsResponse = await fetch(
      "https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    console.log("Status:", topArtistsResponse.status);

    if (topArtistsResponse.ok) {
      const topArtistsData = await topArtistsResponse.json();
      if (topArtistsData.items && topArtistsData.items.length > 0) {
        console.log("Top artists:");
        topArtistsData.items.forEach((artist, i) => {
          console.log(
            `${i + 1}. ${artist.name} - Genres: ${(artist.genres || []).join(", ")}`,
          );
        });
        console.log(
          "Raw response:",
          JSON.stringify(topArtistsData, null, 2).substring(0, 500) + "...",
        );
      } else {
        console.log("No top artists found");
      }
    } else {
      console.error("Error fetching top artists:", topArtistsResponse.status);
    }
  } catch (error) {
    console.error("Error testing Spotify API:", error);
  }
}

testSpotifyAPI();
