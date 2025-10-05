import querystring from "querystring";
import type { IArtistsAPIResponse, ITracksAPIResponse } from "./interface";
import type { SpotifyAccessToken } from "./types";
import { NextRequest, NextResponse } from "next/server";

// We access our values with environment variables,
// we don't want to share these values in our code
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

// Debug logging for environment variable loading
console.log("Spotify API Environment Check:");
console.log("- SPOTIFY_CLIENT_ID exists:", !!client_id);
console.log("- SPOTIFY_CLIENT_SECRET exists:", !!client_secret);
console.log("- SPOTIFY_REFRESH_TOKEN exists:", !!refresh_token);

// We encode our client_id and client_secret again to send with the POST request.
// This is a part of the authorization header
const basic: string = Buffer.from(`${client_id}:${client_secret}`).toString(
  "base64",
);
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

const LAST_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

// This function gets the access token so that we can access the API
const getAccessToken = async (): Promise<SpotifyAccessToken> => {
  // Check if credentials are available
  if (!client_id || !client_secret || !refresh_token) {
    console.error(
      "Spotify credentials missing. Check your environment variables.",
    );
    return { access_token: "NO ACCESS", error: "Missing credentials" };
  }

  const request: NextRequest = new NextRequest(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  try {
    const response: Response = await fetch(request);
    const data = await response.json();

    // Check if the response contains an error
    if (data.error) {
      console.error("Spotify API error:", data.error, data.error_description);
      return {
        access_token: "NO ACCESS",
        error: data.error,
        error_description: data.error_description,
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to get Spotify access token:", error);
    return { access_token: "NO ACCESS", error: "Request failed" };
  }
};

/**
 * Makes a request to the Spotify API to retrieve the user's top tracks.
 */
export const topTracks = async (): Promise<ITracksAPIResponse[]> => {
  // Obtain an access token
  const { access_token }: { access_token: string } = await getAccessToken();

  // Make a request to the Spotify API to retrieve the user's top tracks in last 4 weeks

  const response = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term",
    {
      headers: {
        // Set the Authorization header with the access token
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  // Handle the response and convert it to the expected type
  if (!response.ok) {
    throw new Error("Failed to fetch top artists.");
  }
  const data = await response.json();
  // @ts-ignore
  return data.items as ITracksAPIResponse[];
};

/**
 * Makes a request to the Spotify API to retrieve the user's top artists.
 */
export const topArtists = async (): Promise<IArtistsAPIResponse[]> => {
  // Obtain an access token
  const { access_token } = await getAccessToken();

  // Make a request to the Spotify API to retrieve the user's top artists in last 4 weeks
  const response = await fetch(
    "https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term",
    {
      headers: {
        // Set the Authorization header with the access token
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  // Handle the response and convert it to the expected type
  if (!response.ok) {
    throw new Error("Failed to fetch top artists.");
  }

  const data = await response.json();
  // @ts-ignore
  return data.items as IArtistsAPIResponse[];
};

/**
 * Makes a request to the Spotify API to retrieve the currently playing song for the user.
 */
export const currentlyPlayingSong = async (_initialRequest: NextRequest) => {
  const f = "currentlyPlayingSong";
  console.log({ f });
  // Obtain an access token
  const { access_token, error } = await getAccessToken();

  // If there was an error getting the access token, return early
  if (error || access_token === "NO ACCESS") {
    console.error(
      "Error getting Spotify access token:",
      error || "Token not obtained",
    );
    const response: NextResponse = new NextResponse(null, {
      status: 500,
    });
    return response;
  }

  const request = new NextRequest(NOW_PLAYING_ENDPOINT, {
    headers: {
      // Set the Authorization header with the access token
      Authorization: `Bearer ${access_token}`,
    },
  });

  try {
    console.log("Fetching currently playing from Spotify API...");
    const response: Response = await fetch(request);

    if (!response.ok && response.status !== 204) {
      console.error("Spotify API error:", response.status, response.statusText);
    } else {
      console.log("Spotify API response status:", response.status);
    }

    return response;
  } catch (error) {
    console.error("Error fetching from Spotify API:", error);
    const response: NextResponse = new NextResponse(null, {
      status: 500,
    });
    return response;
  }
};

export const lastPlayedSong = async (_initialRequest: NextRequest) => {
  const f = "lastPlayedSong";
  console.log({ f });
  // Obtain an access token
  const { access_token, error } = await getAccessToken();

  // If there was an error getting the access token, return early
  if (error || access_token === "NO ACCESS") {
    console.error(
      "Error getting Spotify access token:",
      error || "Token not obtained",
    );
    const response: NextResponse = new NextResponse(null, {
      status: 500,
    });
    return response;
  }

  // Update the endpoint with a limit parameter
  const lastPlayedEndpoint = `${LAST_PLAYED_ENDPOINT}?limit=1`;

  const request = new NextRequest(lastPlayedEndpoint, {
    headers: {
      // Set the Authorization header with the access token
      Authorization: `Bearer ${access_token}`,
    },
  });

  try {
    console.log("Fetching last played from Spotify API...");
    const response: Response = await fetch(request);

    if (!response.ok) {
      console.error(
        "Spotify API error (last played):",
        response.status,
        response.statusText,
      );
    } else {
      console.log(
        "Spotify API response status (last played):",
        response.status,
      );
    }

    return response;
  } catch (error) {
    console.error("Error fetching from Spotify API (last played):", error);
    const response: NextResponse = new NextResponse(null, {
      status: 500,
    });
    return response;
  }
};
