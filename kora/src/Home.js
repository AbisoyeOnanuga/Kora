import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-node";
import PlaylistCard from "./PlaylistCard";

const spotifyApi = new SpotifyWebApi({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "YOUR_REDIRECT_URI",
});

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState("");
  const [length, setLength] = useState(0);
  const [generatedPlaylist, setGeneratedPlaylist] = useState(null);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);

  useEffect(() => {
    // Get the access token from the URL
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");

    if (accessToken) {
      // Set the access token on the API object
      spotifyApi.setAccessToken(accessToken);
      // Set the logged in state to true
      setLoggedIn(true);
      // Get the user's profile
      spotifyApi.getMe().then((res) => {
        setUser(res.body);
      });
      // Get the featured playlists
      spotifyApi.getFeaturedPlaylists().then((res) => {
        setFeaturedPlaylists(res.body.playlists.items);
      });
    }
  }, []);

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
  };

  const handleLengthChange = (e) => {
    setLength(e.target.value);
  };

  const handleGeneratePlaylist = () => {
    // TODO: Call your ML model to generate a playlist based on the activity and length
    // For now, we'll just use a dummy playlist
    const dummyPlaylist = {
      id: "37i9dQZF1DXcBWIGoYBM5M",
      name: "Today's Top Hits",
      description: "The biggest songs in the world right now.",
      images: [
        {
          url:
            "https://i.scdn.co/image/ab67706f00000003a0b9c0f9e851b7f3a4a9b2a8",
        },
      ],
    };
    setGeneratedPlaylist(dummyPlaylist);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">React-Spotify Playlist Generator</h1>
          {loggedIn && user && (
            <div className="flex items-center gap-2">
              <img
                src={user.images[0].url}
                alt={user.display_name}
                className="w-8 h-8 rounded-full"
              />
              <span>{user.display_name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!loggedIn && (
            <a
              href="https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=token&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-modify-public%20playlist-modify-private"
              className="bg-green-600 px-4 py-2 rounded-lg"
            >
              Login with Spotify
            </a>
          )}
          {loggedIn && generatedPlaylist && (
            <Link
              to={`/playlist/${generatedPlaylist.id}`}
              className="bg-green-600 px-4 py-2 rounded-lg"
            >
              View Generated Playlist
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-1">
            <div className="bg-gray-800 w-64 p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Demo</h2>
                    <p className="text-sm">
                    This is a demo app that showcases how to use React, Tailwind CSS,
                    and Spotify Web API to create a playlist generator app. The app uses
                    a dummy ML model to generate playlists based on the user's input.
                    The app also displays the featured playlists from Spotify.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Contact</h2>
                    <p className="text-sm">
                    If you have any questions or feedback, please feel free to contact
                    me at myemail@example.com.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Links</h2>
                    <ul className="text-sm list-disc list-inside">
                    <li>
                        <a href="https://github.com/myusername/react-spotify-playlist-generator">
                        GitHub Repository
                        </a>
                    </li>
                    <li>
                        <a href="https://tailwindcss.com/">Tailwind CSS</a>
                    </li>
                    <li>
                        <a href="https://developer.spotify.com/documentation/web-api/">
                        Spotify Web API
                        </a>
                    </li>
                    <li>
                        <a href="https://www.okta.com/">Okta</a>
                    </li>
                    </ul>
                </div>
            </div>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-gray-800 p-4 flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Playlist Generator</h2>
                    <p className="text-sm">
                    Enter the activity and the length of the playlist you want to
                    generate, and our ML model will create a personalized playlist for
                    you based on your Spotify profile.
                    </p>
                    <div className="flex items-center gap-4">
                    <label htmlFor="activity" className="text-sm">
                        Activity:
                    </label>
                    <input
                        type="text"
                        id="activity"
                        value={activity}
                        onChange={handleActivityChange}
                        className="bg-gray-700 px-2 py-1 rounded-lg"
                    />
                    </div>
                    <div className="flex items-center gap-4">
                    <label htmlFor="length" className="text-sm">
                        Length (in minutes):
                    </label>
                    <input
                        type="number"
                        id="length"
                        value={length}
                        onChange={handleLengthChange}
                        className="bg-gray-700 px-2 py-1 rounded-lg"
                    />
                    </div>
                    <button
                    onClick={handleGeneratePlaylist}
                    className="bg-green-600 px-4 py-2 rounded-lg self-end"
                    >
                    Generate Playlist
                    </button>
                </div>
                <div className="bg-gray-800 p-4 flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Featured Playlists</h2>
                    <p className="text-sm">
                    Here are some of the playlists that our ML model and our users have
                    created from their prompts. You can click on any playlist to view
                    its tracks and details.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                    {featuredPlaylists.map((playlist) => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                    </div>
                </div>
            </div>
      </div>
    </div>
  );}

export default Home;
