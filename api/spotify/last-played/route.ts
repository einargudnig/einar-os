import { lastPlayedSong } from "../lib";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const url = request.url;
  const response = await lastPlayedSong(request);

  if (response.status > 400) {
    return NextResponse.json(
      {
        error: `Spotify API returned status ${response.status}`,
        now: Date.now(),
      },
      {
        status: response.status,
        headers: response.headers,
      },
    );
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return new NextResponse(null, {
      status: 404,
      headers: response.headers,
    });
  }

  // Get the most recently played track
  const recentTrack = data.items[0];
  const track = recentTrack.track;

  const title = track?.name ?? "Unknown track";
  const artist =
    track?.artists
      .map((_artist: { name: string }) => _artist.name)
      .join(", ") || "Unknown artist";
  const album = track?.album?.name ?? "Unknown album";
  const albumUrl = track?.album?.external_urls?.spotify ?? null;
  const albumImageUrl = track?.album?.images[0]?.url ?? null;
  const songUrl = track?.external_urls?.spotify ?? null;
  const playedAt = recentTrack.played_at ?? null;

  const trackData = {
    album,
    albumUrl,
    artist,
    albumImageUrl,
    isPlaying: false,
    songUrl,
    title,
    playedAt,
    isRecentlyPlayed: true,
  };

  if (url) {
    revalidatePath(url);
    const jsonResponse = NextResponse.json(
      {
        revalidated: true,
        now: Date.now(),
        data: trackData,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return jsonResponse;
  }

  const jsonResponse = NextResponse.json(
    {
      revalidated: false,
      now: Date.now(),
      data: trackData,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return jsonResponse;
}
