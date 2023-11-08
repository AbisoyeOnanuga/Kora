import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "YOUR_REDIRECT_URI",
});

function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
    }
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      {!loggedIn && (
        <a
          href="https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=token&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-modify-public%20playlist-modify-private"
          className="bg-green-600 px-4 py-2 rounded-lg"
        >
          Login with Spotify
        </a>
      )}
      {loggedIn && user && (
        <div className="flex flex-col items-center gap-4">
          <img
            src={user.images[0].url}
            alt={user.display_name}
            className="w-32 h-32 rounded-full"
          />
          <h1 className="text-2xl font-bold">{user.display_name}</h1>
          <p className="text-sm">{user.email}</p>
          <Link to="/" className="bg-green-600 px-4 py-2 rounded-lg">
            Go to Home
          </Link>
        </div>
      )}
    </div>
  );
}

export default Login;