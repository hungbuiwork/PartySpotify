import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Queue = () => {
  const location = useLocation();
  const [accessToken, setAccessToken] = useState("");
  const [searchQuery, setSearchQuery] = useState(" ");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("access_token");
    // console.log(token);
    if (!token) {
      setAccessToken("No access token");
      return;
    }
    setAccessToken(token);
  }, [location]);

  const setQuery = (event) => {
    setSearchQuery(event.target.value);
  };

  const search = () => {
    const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";
    const TYPE = ["track"];
    const QUERY = searchQuery;

    fetch(`${SEARCH_ENDPOINT}?type=${TYPE}&q=${QUERY}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((data) =>
      data.json().then((dataJSON) => setSearchResults(dataJSON?.tracks?.items))
    );
    // console.log(searchResults);
  };

  const queue = (uri) => {
    fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }

)

  }

  useEffect(search, []);

  return (
    <div>
      Queue {accessToken}
      <div className=" input-group ">
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
          onChange={setQuery}
        />
        <button class="btn btn-square" onClick={search}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
      {searchResults?.map((track, i) => (
        <button onClick = {()=>queue(track?.uri)} key={track.id}>
          <div className=" border-2 border-white p-3 rounded-md flex items-center">
            <img src = {track?.album?.images?.[0]?.url} className=" h-16"></img>
            <div className=" border-2 rounded-2 h-16 w-64 border-white flex flex-col justify-center"><h1 className=" border-2">{track.name}</h1></div>
            <h2 className=" border-2 border-white"> {track?.artists.map((a) => a?.name).join(", ")}</h2>
          </div>
          {/* You can add more track information here */}
        </button>
      ))}
    </div>
  );
};
