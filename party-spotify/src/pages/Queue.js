import React, { useEffect, useState, useCallback } from "react";


const debounce = (func, wait) => {
    let timeout;
      
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }
  }




export const Queue = () => {
  const location = window.location;
  const [accessToken, setAccessToken] = useState("");
  const [searchQuery, setSearchQuery] = useState(" ");
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.hash.substring(1));
    const token = params.get("access_token");
    // console.log(token);
    if (!token) {
      setAccessToken("No access token");
      return;
    }
    setAccessToken(token);
  }, [location]);



  const search = () => {
    const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";
    const TYPE = ["track"];
    const QUERY = searchQuery;

    fetch(`${SEARCH_ENDPOINT}?type=${TYPE}&q=${QUERY}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((data) => {
      data.json().then((dataJSON) => setSearchResults(dataJSON?.tracks?.items));
      setQueuedSongs([]);
    });
    // console.log(searchResults);
  };

  const debouncedSearch = debounce(search, 1000);
  const setQuery = (event) => {
    setSearchQuery(event.target.value);
    search();
  };

  const queue = (uri, idx) => {
    fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(() => {
      setQueuedSongs((prevQueuedSongs) => [...prevQueuedSongs, idx]);
    });
  };

  useEffect(search, []);
  return (
    <div>
      <div className=" input-group ">
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full "
          onChange={setQuery}
        />
      </div>
      <div className=" flex flex-col border-0 border-red-600 px-2">
        {searchResults?.map((track, i) => (
          <button
            onClick={() => queue(track?.uri, i)}
            key={track.id}
            className={` ${
              queuedSongs.includes(i) ? "btn-disabled" : "btn-active"
            } `}
          >
            <div
              className={` border-0 mb-3 border-white h-24 mx-8 rounded-md flex items-center ${
                queuedSongs.includes(i) ? "bg-emerald-600" : "bg-black"
              } `}
            >
              <img src={track?.album?.images?.[0]?.url} className=" h-full"></img>
              <div className=" border-0 rounded-2 h-16 w-64  border-white flex flex-col justify-center">
                <h1 className=" border-0">{track.name}</h1>
              </div>
              <h2 className=" border-0 border-white">
                {" "}
                {track?.artists.map((a) => a?.name).join(", ")}
              </h2>
            </div>
            {/* You can add more track information here */}
          </button>
        ))}
      </div>
    </div>
  );
};
