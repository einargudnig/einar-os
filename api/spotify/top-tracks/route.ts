import { topTracks } from "../lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tracks = await topTracks();

    if (!tracks || tracks.length === 0) {
      return NextResponse.json(
        {
          error: "No top tracks found",
        },
        { status: 404 },
      );
    }

    // Format tracks for the response
    const formattedTracks = tracks.map((track) => ({
      title: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      album: track.album.name,
      albumUrl: track.album.external_urls.spotify,
      albumImageUrl: track.album.images[0]?.url,
      songUrl: track.external_urls.spotify,
      duration: track.duration_ms,
      popularity: track.popularity,
    }));

    return NextResponse.json(
      {
        tracks: formattedTracks,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch top tracks",
      },
      { status: 500 },
    );
  }
}
