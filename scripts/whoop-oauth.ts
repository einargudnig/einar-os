#!/usr/bin/env bun

/**
 * OAuth authentication helper for Whoop API
 * Run this script to get your initial access and refresh tokens
 */

import open from "open";

const WHOOP_CLIENT_ID = process.env.WHOOP_CLIENT_ID;
const WHOOP_CLIENT_SECRET = process.env.WHOOP_CLIENT_SECRET;
const REDIRECT_URI =
  process.env.WHOOP_REDIRECT_URI || "http://localhost:3000/callback";
const PORT = 3000;

if (!WHOOP_CLIENT_ID || !WHOOP_CLIENT_SECRET) {
  console.error("Error: WHOOP_CLIENT_ID and WHOOP_CLIENT_SECRET must be set");
  console.error("Get your credentials from: https://developer.whoop.com/");
  process.exit(1);
}

const clientId: string = WHOOP_CLIENT_ID;
const clientSecret: string = WHOOP_CLIENT_SECRET;

const SCOPES = [
  "offline",
  "read:recovery",
  "read:cycles",
  "read:workout",
  "read:sleep",
  "read:profile",
  "read:body_measurement",
].join(" ");

// Generate a random state parameter for OAuth security
const state = crypto.randomUUID();

const authUrl = new URL("https://api.prod.whoop.com/oauth/oauth2/auth");
authUrl.searchParams.append("client_id", clientId);
authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
authUrl.searchParams.append("response_type", "code");
authUrl.searchParams.append("scope", SCOPES);
authUrl.searchParams.append("state", state);

console.log("\n🏃 Whoop OAuth Authentication\n");
console.log("Starting local callback server on port", PORT);
console.log("Opening browser for authorization...\n");

let serverInstance: any;

async function exchangeCodeForTokens(code: string) {
  console.log("\n📡 Exchanging code for tokens...\n");

  try {
    const response = await fetch(
      "https://api.prod.whoop.com/oauth/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code.trim(),
          redirect_uri: REDIRECT_URI,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get tokens: ${response.statusText}\n${error}`);
    }

    const data = await response.json();

    const tokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
    };

    await Bun.write(".whoop-tokens.json", JSON.stringify(tokens, null, 2));

    console.log("✅ Success! Tokens saved to .whoop-tokens.json\n");
    console.log("You can now run the cron job with: npm run whoop:fetch\n");

    serverInstance?.stop();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    serverInstance?.stop();
    process.exit(1);
  }
}

serverInstance = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const returnedState = url.searchParams.get("state");
      const error = url.searchParams.get("error");

      if (error) {
        console.error("\n❌ Authorization failed:", error);
        const errorDescription = url.searchParams.get("error_description");
        if (errorDescription) {
          console.error("   Description:", errorDescription);
        }

        return new Response(
          `<html><body><h1>❌ Authorization Failed</h1><p>${error}</p><p>${errorDescription || ""}</p><p>You can close this window.</p></body></html>`,
          {
            headers: { "Content-Type": "text/html" },
            status: 400,
          },
        );
      }

      // Verify state parameter matches for security
      if (returnedState !== state) {
        console.error("\n❌ State mismatch - possible CSRF attack");
        return new Response(
          "<html><body><h1>❌ Security Error</h1><p>State parameter mismatch. Please try again.</p><p>You can close this window.</p></body></html>",
          {
            headers: { "Content-Type": "text/html" },
            status: 400,
          },
        );
      }

      if (!code) {
        return new Response(
          "<html><body><h1>❌ No authorization code received</h1><p>You can close this window.</p></body></html>",
          {
            headers: { "Content-Type": "text/html" },
            status: 400,
          },
        );
      }

      exchangeCodeForTokens(code);

      return new Response(
        "<html><body><h1>✅ Authorization Successful!</h1><p>You can close this window and return to your terminal.</p></body></html>",
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Callback server listening on http://localhost:${PORT}`);

try {
  await open(authUrl.toString());
  console.log("Browser opened. Waiting for authorization...\n");
} catch (error) {
  console.log("Could not open browser automatically.");
  console.log("Please open this URL manually:\n");
  console.log(`   ${authUrl.toString()}\n`);
}

console.log("Waiting for callback... (Press Ctrl+C to cancel)");
