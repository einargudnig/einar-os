import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if the Spotify credentials exist in environment variables
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

    // Test token retrieval
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64",
    );
    const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

    // Try to get a token
    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token || "",
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    // Return debug information (without exposing full tokens)
    return NextResponse.json(
      {
        env_check: {
          client_id_exists: !!client_id,
          client_secret_exists: !!client_secret,
          refresh_token_exists: !!refresh_token,
        },
        token_response: {
          status: tokenResponse.status,
          ok: tokenResponse.ok,
          has_access_token: !!tokenData.access_token,
          error: tokenData.error,
          error_description: tokenData.error_description,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      {
        error: "Failed to test Spotify connection",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
