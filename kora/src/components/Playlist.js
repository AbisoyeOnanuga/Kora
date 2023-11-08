import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "YOUR_REDIRECT_URI",
});

function Playlist() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    // Get the access token from the URL
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");

    if (accessToken) {
      // Set the access token on the API object
      spotifyApi.setAccessToken(accessToken);
      // Get the playlist details
      spotifyApi.getPlaylist(id).then((res) => {
        setPlaylist(res.body);
      });
      // Get the playlist tracks
      spotifyApi.getPlaylistTracks(id).then((res) => {
        setTracks(res.body.items);
      });
    }
  }, [id]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">React-Spotify Playlist Generator</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="bg-green-600 px-4 py-2 rounded-lg">
            Go to Home
          </Link>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        {playlist && (
          <div className="bg-gray-800 p-4 flex items-center gap-4">
            <img
              src={playlist.images[0].url}
              alt={playlist.name}
              className="w-32 h-32 rounded-lg"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">{playlist.name}</h2>
              <p className="text-sm">{playlist.description}</p>
              <p className="text-sm">
                {playlist.tracks.total} tracks, {playlist.followers.total}{" "}
                followers
              </p>
            </div>
          </div>
        )}
        {tracks && (
          <div className="bg-gray-800 p-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold">Tracks</h2>
            <ul className="text-sm list-decimal list-inside">
              {tracks.map((track) => (
                <li key={track.track.id}>
                  {track.track.name} by{" "}
                  {track.track.artists.map((artist) => artist.name).join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Playlist;