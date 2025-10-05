import { topArtists } from "../lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const artists = await topArtists();

    if (!artists || artists.length === 0) {
      return NextResponse.json(
        {
          error: "No top artists found",
        },
        { status: 404 },
      );
    }

    // Format artists for the response
    const formattedArtists = artists.map((artist) => ({
      name: artist.name,
      url: artist.external_urls.spotify,
      imageUrl: artist.images?.[0]?.url,
      genres: artist.genres || [],
      followers: artist.followers.total,
      popularity: artist.popularity,
    }));

    return NextResponse.json(
      {
        artists: formattedArtists,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch top artists",
      },
      { status: 500 },
    );
  }
}
