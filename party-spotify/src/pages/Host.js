import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { FaFastBackward, FaFastForward, FaPause, FaPlay } from "react-icons/fa";
import { Login } from "./Login";
import { Queue } from "./Queue";
import { host_name } from "../Global";

export const Host = () => {
  const location = window.location;
  const [queueMode, setQueueMode] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [currentSong, setCurrentSong] = useState("");
  const [myInfo, setMyInfo] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [deviceID, setDeviceID] = useState("");

  // GET ACCESS TOKEN
  useEffect(() => {
    const params = new URLSearchParams(location.hash.substring(1));
    const token = params.get("access_token");
    if (!token) {
      setAccessToken("");
    } else {
      setAccessToken(token);
    }

    const queue = params.get("queue_mode");
    if (!queue) {
      setQueueMode(false);
    } else {
      setQueueMode(true);
    }
  }, [location]);

  //   //REFRESH ACCESS TOKEN IF NEEDED
  //   const refreshToken = () => {
  //     const CLIENT_ID = "1e38d15cb1a84430a78653561e1852cb";
  //     const REFRESH_ENDPOINT = "https://accounts.spotify.com/api/token";

  //     fetch(`${REFRESH_ENDPOINT}?grant_type=refresh_token?`)
  //   }

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
    const updateCurrentSong = async () => {
      if (accessToken == "") return;
      fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (response.status === 204) {
            console.log("No music is currently playing");
            return undefined;
          }
          return response.json();
        })
        .then((jsonData) => {
          setCurrentSong(jsonData);
          setIsPlaying(jsonData?.is_playing);
        });
    };

    updateCurrentSong();
    const intervalId = setInterval(() => {
      updateCurrentSong();
    }, 500);

    return () => clearInterval(intervalId);
  }, [accessToken]);

  useEffect(() => {
    const cacheDevice = async () => {
      if (accessToken == "") return;
      fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (response.status === 204) {
            console.log("No music is currently playing");
            return undefined;
          }
          return response.json();
        })
        .then((jsonData) => {
          if (jsonData?.device?.id) {
            setDeviceID(jsonData.device.id);
          }
        });
    };

    cacheDevice();
    console.log("DEVICE:", deviceID);
    const intervalId2 = setInterval(() => {
      cacheDevice();
    }, 1000);

    return () => clearInterval(intervalId2);
  }, [accessToken]);

  useEffect(() => {
    const updateCurrentQueue = async () => {
      if (accessToken == "") return;
      fetch("https://api.spotify.com/v1/me/player/queue", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (response.status === 204) {
            console.log("No music is currently playing");
            return undefined;
          }
          return response.json();
        })
        .then((jsonData) => {
          setCurrentQueue(jsonData);
        });
    };
    updateCurrentQueue();
    const intervalId = setInterval(() => {
      updateCurrentQueue();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [accessToken]);

  const play = () => {
    if (accessToken == "" || deviceID == "") return;
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    //setIsPlaying(true);
  };

  const pause = () => {
    if (accessToken == "") return;
    fetch("https://api.spotify.com/v1/me/player/pause", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setIsPlaying(false);
  };

  const next = () => {
    if (accessToken == "") return;
    fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then();
  };

  const prev = () => {
    if (accessToken == "") return;
    fetch("https://api.spotify.com/v1/me/player/previous", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setIsPlaying(true);
  };

  const seek = (event) => {
    if (accessToken == "") return;
    fetch(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${parseInt(
        (event.target.value / event.target.max) * currentSong?.item?.duration_ms
      )}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setIsPlaying(true);
  };

  if (accessToken == "") {
    return <Login></Login>;
  } else if (queueMode == true) {
    return <Queue></Queue>;
  }

  return (
    <div className=" font-bold bg-[#0b0b0e]">
      {/* <div className=" absolute m-4">
        <h1>{myInfo?.display_name}</h1>
        <img src={myInfo?.images?.[0].url} className=" h-32 w-32"></img>
      </div> */}

      <div className=" absolute w-[100vw] h-[100vh] hidden lg:flex justify-between p-4">
        {/* Background Image */}
        <img
          src={currentSong?.item?.album?.images?.[0]?.url}
          className=""
        ></img>
        <div className=" flex flex-col justify-between">
          <h1 className=" text-white text-4xl font-bold right-4 mr-8 hidden lg:inline text-right">
            Party<span className=" text-[#1DB954] font-extrabold ">ify</span>
          </h1>
          <h1 className="text-[#1DB954] text-xl font-thin right-4 mr-8 hidden lg:inline text-right">
            Connected to{" "}
            <span className=" font-bold">{myInfo?.display_name}</span>
          </h1>
        </div>
      </div>

      <div className=" lg:h-[100vh] flex flex-col justify-center border-0 relative">
        <div className=" flex justify-between px-12 lg_hidden">
          <h1 className=" text-white text-3xl font-bold  my-2 lg:hidden">
            Party<span className=" text-[#1DB954] font-extrabold">ify</span>
          </h1>
          <h1 className="text-[#1DB954] text-sm font-thin right-4 lg:hidden text-right self-center">
            Connected to 
            <span className=" font-bold"> {myInfo?.display_name}</span>
          </h1>
        </div>
        <div className=" flex flex-col lg:flex-row justify-center bg-gradient-to-b lg:bg-gradient-to-r from-[#1DB954]/60 to-transparent p-6 lg:p-12 mx-12 lg:mx-32 rounded-2xl backdrop-blur-md">
          {/* ---------SONG INFO---------- */}
          <div className="  lg:w-[60vh]">
            {currentSong?.item?.album?.images?.[0] ? (
              <img
                src={currentSong?.item?.album?.images?.[0]?.url}
                className=" w-full rounded-lg"
              ></img>
            ) : (
              <div className=" skeleton h-[60vh] w-full"></div>
            )}

            {currentSong?.item?.name ? (
              <h1 className="  text-white text-3xl font-medium mt-4">
                {currentSong?.item?.name}
              </h1>
            ) : (
              <div>
                <h1 className="  text-white text-3xl font-medium">
                  No song playing ...
                </h1>
                <h2 className="text-white text-xl font-thin">
                  Try pressing play on your Spotify App, or Re-login to
                  Partyify!
                </h2>
              </div>
            )}
            <h2 className="  text-white text-xl font-thin">
              {currentSong?.item?.artists.map((a) => a?.name).join(", ")}
            </h2>
            <div className=" relative">
              <progress
                className="progress progress-accent w-full"
                value={
                  ((currentSong?.progress_ms || 0) * 100) /
                  currentSong?.item?.duration_ms
                }
                max="100"
              ></progress>
              <input
                type="range"
                min="0"
                max="100"
                className="range range-xs range-success h-1 absolute my-auto left-0 top-3 opacity-0"
                onMouseUp={seek}
              />
            </div>

            <div className=" flex justify-center">
              <button
                onClick={prev}
                className=" p-4 text-white text-3xl hover:text-accent duration-200"
              >
                <FaFastBackward></FaFastBackward>
              </button>
              {isPlaying ? (
                <button
                  onClick={pause}
                  className=" p-4 text-white text-3xl hover:text-accent duration-200"
                >
                  <FaPause></FaPause>
                </button>
              ) : (
                <button
                  onClick={play}
                  className=" p-4 text-white text-3xl hover:text-accent duration-200"
                >
                  <FaPlay></FaPlay>
                </button>
              )}
              <button
                onClick={next}
                className=" p-4 text-white text-3xl hover:text-accent duration-200"
              >
                <FaFastForward></FaFastForward>
              </button>
            </div>
          </div>

          {/* ------- QUEUE INFO ------- */}
          <div className=" ml-4   lg:h-[30rem] p-2 mr-2 rounded-xl overflow-hidden flex-shrink">
            {currentQueue?.queue && currentQueue.queue.length > 0 && (
              <h1 className=" text-white text-2xl font-semibold mb-2 whitespace-nowrap">
                Up Next ...
              </h1>
            )}
            {currentQueue?.queue?.map((song, i) => {
              return (
                <p className=" text-white text-md font-light relative hover:font-bold duration-200">
                  {i}. {song.name}
                </p>
              );
            })}
          </div>
          <div className=" lg:w-96 h-full flex flex-col justify-center items-center ">
            <a
              className=" border-8 relative bottom-0 hover:bottom-2 duration-200 border-white rounded-md mt-4 mx-4 "
              target="_blank"
              href={`${
                host_name + window.location.pathname
              }#access_token=${accessToken}&queue_mode=true`}
            >
              <QRCode
                value={`${
                  host_name + window.location.pathname
                }#access_token=${accessToken}&queue_mode=true`}
                className=" border-12 border-white"
                size={256}
              ></QRCode>
            </a>
            <h1 className=" text-white font-medium text-2xl mt-2">
              Add to Queue
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
