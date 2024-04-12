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
    <div className="App bg-[#141519]">
      <header className="App-header">

      <h1 className=" text-white  text-8xl font-bold right-4">Party<span className=" text-[#1DB954] font-extrabold ">ify</span></h1>
      <h2 className=" text-xl font-thin mt-4">Queue songs at any gathering with just a QR scan. </h2>

        <a
        className="text-white hover:bg-white hover:text-black duration-500 bg-[#1DB954] py-3 px-8 hover:px-16 rounded-full font-normal mt-16"
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
        >
          Log in to Spotify
        </a>
      </header>
    </div>
  );
};
