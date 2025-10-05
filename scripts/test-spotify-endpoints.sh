#!/bin/bash

echo "Testing Spotify API endpoints..."
echo "================================"

echo -e "\nTesting /api/spotify/current"
curl -s http://localhost:3000/api/spotify/current

echo -e "\n\nTesting /api/spotify/last-played"
curl -s http://localhost:3000/api/spotify/last-played

echo -e "\n\nTesting /api/spotify/top-tracks"
curl -s http://localhost:3000/api/spotify/top-tracks

echo -e "\n\nTesting /api/spotify/top-artists"
curl -s http://localhost:3000/api/spotify/top-artists

echo -e "\n"