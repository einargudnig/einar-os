"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import fetcher from "@/lib/fetcher";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SongData {
  albumImageUrl: string;
  isPlaying: boolean;
  songUrl: string | null;
  title: string | null;
  artist: string | null;
  album: string | null;
  albumUrl: string | null;
  isRecentlyPlayed?: boolean;
  playedAt?: string;
}

interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumUrl: string;
  albumImageUrl: string;
  songUrl: string;
  duration: number;
  popularity: number;
}

interface SpotifyArtist {
  name: string;
  url: string;
  imageUrl: string;
  genres: string[];
  followers: number;
  popularity: number;
}

export const NowPlaying = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Fetch current song with a 5 second refresh interval
  const { data: currentData, error: currentError } = useSWR<{ data: SongData }>(
    "/api/spotify/current",
    fetcher,
    { refreshInterval: 5000, revalidateOnFocus: true },
  );

  // Fetch last played song as fallback
  const { data: lastPlayedData } = useSWR<{ data: SongData }>(
    currentError || !currentData?.data?.isPlaying
      ? "/api/spotify/last-played"
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  // Only fetch top tracks and artists when stats are shown
  const { data: topTracksData } = useSWR<{ tracks: SpotifyTrack[] }>(
    showStats ? "/api/spotify/top-tracks" : null,
    fetcher,
  );

  const { data: topArtistsData } = useSWR<{ artists: SpotifyArtist[] }>(
    showStats ? "/api/spotify/top-artists" : null,
    fetcher,
  );

  const isLoading = !currentData && !lastPlayedData && !currentError;

  // Use current playing song if available, otherwise use last played
  const songData = currentData?.data?.isPlaying
    ? currentData?.data
    : lastPlayedData?.data;

  // Handle loading state
  if (isLoading) {
    return (
      <div>
        <Badge variant="outline">Loading...</Badge>
      </div>
    );
  }

  // Handle no data
  if (!songData) {
    return (
      <div className="flex flex-col">
        <div>
          <Badge variant="outline">Not connected to Spotify</Badge>
        </div>
        <Link
          href="/docs/spotify-setup.md"
          className="text-xs mt-2 text-blue-500 hover:underline"
        >
          Troubleshoot connection
        </Link>
      </div>
    );
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    // Reset stats if hiding details
    if (showDetails && showStats) {
      setShowStats(false);
    }
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={toggleDetails}>
            <div className="flex items-center">
              <Badge variant={songData.isPlaying ? "default" : "outline"}>
                {songData.isRecentlyPlayed ? "Last played: " : ""}
                {songData.title} - {songData.artist}
              </Badge>
              <span className="ml-1">
                <svg className="h-4 w-4" viewBox="0 0 168 168">
                  <path
                    fill="#1ED760"
                    d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l.001-.004zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35a6.538 6.538 0 014.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z"
                  />
                </svg>
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {songData.isPlaying
              ? "Now playing on Spotify"
              : "Last played on Spotify"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showDetails && songData && (
        <Card className="mt-2 p-3 bg-slate-100 dark:bg-slate-800">
          <div className="flex flex-col sm:flex-row gap-3">
            {songData.albumImageUrl && (
              <div className="flex-shrink-0">
                {/* Using Next.js Image component for optimized loading */}
                <img
                  src={songData.albumImageUrl}
                  alt={`${songData.album} album cover`}
                  className="w-16 h-16 rounded-sm"
                  width={64}
                  height={64}
                />
              </div>
            )}
            <div className="text-xs flex-grow">
              <p>
                <strong>Song:</strong> {songData.title || "Unknown"}
              </p>
              <p>
                <strong>Artist:</strong> {songData.artist || "Unknown"}
              </p>
              <p>
                <strong>Album:</strong> {songData.album || "Unknown"}
              </p>
              {songData.playedAt && (
                <p>
                  <strong>Played:</strong>{" "}
                  {new Date(songData.playedAt).toLocaleString()}
                </p>
              )}
              {songData.songUrl && (
                <p className="mt-1">
                  <Link
                    href={songData.songUrl}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    Open in Spotify
                  </Link>
                </p>
              )}
              <div className="mt-2">
                <button
                  onClick={toggleStats}
                  className="text-xs text-blue-500 hover:underline"
                >
                  {showStats ? "Hide Stats" : "View Stats"}
                </button>
              </div>
            </div>
          </div>

          {showStats && (
            <div className="mt-3">
              <Separator className="mb-2" />

              <div className="flex flex-col gap-3">
                {topTracksData?.tracks ? (
                  <div>
                    <h4 className="text-xs font-bold mb-1">Top Tracks</h4>
                    <ul className="text-xs">
                      {topTracksData.tracks.slice(0, 3).map((track, index) => (
                        <li key={index} className="mb-1">
                          {index + 1}. {track.title} - {track.artist} (
                          {formatDuration(track.duration)})
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-xs">Loading top tracks...</div>
                )}

                {topArtistsData?.artists ? (
                  <div>
                    <h4 className="text-xs font-bold mb-1">Top Artists</h4>
                    <ul className="text-xs">
                      {topArtistsData.artists
                        .slice(0, 3)
                        .map((artist, index) => (
                          <li key={index} className="mb-1">
                            {index + 1}. {artist.name}
                            {artist.genres && artist.genres.length > 0 && (
                              <span className="opacity-75">
                                {" "}
                                ({artist.genres.slice(0, 2).join(", ")})
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-xs">Loading top artists...</div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
