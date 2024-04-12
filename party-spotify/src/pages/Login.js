import React from "react";
import { host_name } from "../Global";

export const Login = () => {
const location = window.location;
console.log("LOCATION", location)
  const CLIENT_ID = "1e38d15cb1a84430a78653561e1852cb";
  const REDIRECT_URI = host_name + window.location.pathname;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = ["user-read-currently-playing","user-read-playback-state", "user-modify-playback-state"];
  return (
    <div className="App">
      <header className="App-header">
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
        >
          Log in to Spotify
        </a>
      </header>
    </div>
  );
};
