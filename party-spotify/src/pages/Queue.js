import React, { useEffect, useState, useCallback } from "react";

const debounce = (func, wait) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const Queue = () => {
  const location = window.location;
  const [accessToken, setAccessToken] = useState("");
  const [searchQuery, setSearchQuery] = useState(" ");
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [myInfo, setMyInfo] = useState("");

  useEffect(() => {
    if (accessToken == "") return;
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        setMyInfo(jsonData);
      });
  }, [accessToken]);

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
    <div className=" bg-[#0b0b0e] min-h-[100vh] border-2 px-8">
      <h1 className=" text-white text-center  text-6xl font-bold right-4 mb-4 mt-12">
        Party<span className=" text-[#1DB954] font-extrabold ">ify</span>
      </h1>
      <h1 className="text-[#1DB954] text-xl font-thin  text-center">
            Connected to{" "}
            <span className=" font-bold">{myInfo?.display_name}</span>
          </h1>
      <div className=" input-group my-8">
        <input
          type="text"
          placeholder="Search for songs to Queue"
          class="input input-bordered w-full"
          onChange={setQuery}
        />
      </div>
      <div className=" flex flex-col border-0 border-red-600 ">
        {searchResults?.map((track, i) => (
          <button
            onClick={() => queue(track?.uri, i)}
            key={track.id}
            className={`${queuedSongs.includes(i) ? "btn-disabled" : ""} `}
          >
            {queuedSongs.includes(i) && 
              <span class="indicator-item badge text-[#1DB954]">
                Successfully added to queue!
              </span>
            }
            <div
              className={`border-0 overflow-hidden duration-200 my-2  border-white h-24 rounded-md flex items-center ${
                queuedSongs.includes(i)
                  ? "bg-[#1DB954]/50 text-white"
                  : "bg-[#191c28] hover:bg-[#202433] hover:text-white"
              } `}
            >
              <img
                src={track?.album?.images?.[0]?.url}
                className=" h-full"
              ></img>
              <div className=" border-0 rounded-2 h-16 w-64 font-semibold  border-white flex flex-col justify-center mx-8 shrink-0">
                <h1 className=" border-0 text-left">{track.name}</h1>
              </div>
              <h2 className=" border-0 text-left font-thin">
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
