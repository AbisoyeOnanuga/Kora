# Import Streamlit and Spotipy
import os
import dotenv
import pandas as pd
import streamlit as st
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Set the page title and icon
st.set_page_config(page_title="Kora - Spotify Playlist generator", page_icon="https://github.com/dottymatrix/Kora/blob/main/Kora_logo-icon.png?raw=true")

# Load the environment variables from the .env file
dotenv.load_dotenv()

# Define Spotify credentials and scope
client_id = os.environ.get("SPOTIFY_CLIENT_ID")
client_secret = os.environ.get("SPOTIFY_CLIENT_SECRET")
redirect_uri = os.environ.get("SPOTIFY_REDIRECT_URI")
scope = "user-library-read user-top-read playlist-modify-public"

# Create a Spotify object with authentication
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope, open_browser=False))

# Create a title and a subtitle for the app
st.title("Kora")
st.subheader("Create a personalized Spotify playlist based on your activity and preferences")

# Get the user profile from Spotify
user_profile = sp.current_user()

# Display the user name and image
st.write(f"Hello, {user_profile['display_name']}!")
st.image(user_profile["images"][0]["url"], width=200)

# Create a sidebar for user inputs
st.sidebar.header("User Inputs")

# Create a selectbox for the activity
activity = st.sidebar.selectbox("Select your activity", ["study", "workout", "running", "dancing", "cooking", "relaxing", "pop", "rock", "mindfulness", "wakeup", "LoFi", "R&B & chill", "Drum & Bass", "Indie", "Summer", "Jazz"])

# Create a slider for the playlist length
playlist_length = st.sidebar.slider("Select the number of songs", 1, 20, 10)

# Define a dictionary of criteria for each activity
criteria_dict = {
    "study": {"min_tempo": 60, "max_tempo": 120, "min_energy": 0.6, "max_energy": 0.9, "min_valence": 0.5, "max_valence": 0.8},
    "workout": {"min_tempo": 120, "max_tempo": 180, "min_energy": 0.8, "max_energy": 1.0, "min_valence": 0.6, "max_valence": 1.0},
    "running": {"min_tempo": 140, "max_tempo": 180, "min_energy": 0.8, "max_energy": 1.0, "min_valence": 0.6, "max_valence": 1.0},
    "dancing": {"min_tempo": 100, "max_tempo": 160, "min_energy": 0.7, "max_energy": 1.0, "min_valence": 0.7, "max_valence": 1.0},
    "cooking": {"min_tempo": 80, "max_tempo": 140, "min_energy": 0.6, "max_energy": 0.9, "min_valence": 0.6, "max_valence": 0.9},
    "relaxing": {"min_tempo": 40, "max_tempo": 100, "min_energy": 0.0, "max_energy": 0.6, "min_valence": 0.0, "max_valence": 0.6},
    "pop": {"min_tempo": 80, "max_tempo": 160, "min_energy": 0.6, "max_energy": 0.9, "min_valence": 0.6, "max_valence": 0.9},
    "rock": {"min_tempo": 100, "max_tempo": 180, "min_energy": 0.7, "max_energy": 1.0, "min_valence": 0.4, "max_valence": 0.8},
    "mindfulness": {"min_tempo": 40, "max_tempo": 80, "min_energy": 0.0, "max_energy": 0.4, "min_valence": 0.0, "max_valence": 0.4},
    "wakeup": {"min_tempo": 80, "max_tempo": 140, "min_energy": 0.7, "max_energy": 0.9, "min_valence": 0.7, "max_valence": 1.0},
    "LoFi": {"min_tempo": 60, "max_tempo": 120, "min_energy": 0.4, "max_energy": 0.7, "min_valence": 0.4, "max_valence": 0.7},
    "R&B & chill": {"min_tempo": 80, "max_tempo": 140, "min_energy": 0.5, "max_energy": 0.8, "min_valence": 0.5, "max_valence": 0.8},
    "Drum & Bass": {"min_tempo": 140, "max_tempo": 200, "min_energy": 0.8, "max_energy": 1.0, "min_valence": 0.4, "max_valence": 0.8},
    "Indie": {"min_tempo": 80, "max_tempo": 160, "min_energy": 0.5, "max_energy": 0.8, "min_valence": 0.5, "max_valence": 0.8},
    "Summer": {"min_tempo": 100, "max_tempo": 160, "min_energy": 0.7, "max_energy": 0.9, "min_valence": 0.7, "max_valence": 1.0},
    "Jazz": {"min_tempo": 60, "max_tempo": 140, "min_energy": 0.4, "max_energy": 0.7, "min_valence": 0.4, "max_valence": 0.7}
}

# Get the criteria for the selected activity
criteria = criteria_dict[activity]

# Create a button to generate the playlist
if st.sidebar.button("Generate Playlist"):
    # Get the user’s top tracks as seeds
    user_top_tracks = sp.current_user_top_tracks() # This line was missing in your code, causing the error
    seed_tracks = [track["id"] for track in user_top_tracks["items"]]

    # Slice the list to get the first 5 tracks
    seed_tracks = seed_tracks[:5]

    # Get playlist items based on seeds and criteria
    playlist_items = sp.recommendations(seed_tracks=seed_tracks, limit=playlist_length, **criteria)

    # Create a new playlist for the activity
    playlist = sp.user_playlist_create(user_profile["id"], f"{activity} playlist", public=True, description=f"A playlist for {activity} generated by Kora")

    # Get the playlist tracks as URIs
    playlist_tracks = ["spotify:track:" + track["id"] for track in playlist_items["tracks"]]

    # Add the playlist tracks to the playlist
    sp.user_playlist_add_tracks(user_profile["id"], playlist["id"], playlist_tracks)

    # Display the playlist name and link
    st.markdown(f"Your playlist **{playlist['name']}** is ready. You can listen to it here: {playlist['external_urls']['spotify']}")

    # Define a custom function to convert milliseconds to mm:ss format
    def format_duration(ms):
        # Convert milliseconds to seconds
        s = ms / 1000
        # Get the minutes and seconds
        m, s = divmod(s, 60)
        # Return the formatted string
        return f"{int(m)}:{int(s):02d}"

    # Display the playlist tracks as a list
    for track in playlist_items["tracks"]:
        # Get the track name, artists, and duration
        name = track["name"]
        artists = ", ".join([artist["name"] for artist in track["artists"]])
        duration = format_duration(track["duration_ms"])
        # Display the track information as formatted text
        st.markdown(f"**{name}** by **{artists}** ({duration})")
        # Display the audio player for the track
        st.audio(track["preview_url"], format="audio/mp3")