import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";
import { FaFastBackward, FaFastForward, FaPause, FaPlay } from "react-icons/fa";

export const Host = () => {
  const location = useLocation();
  const [accessToken, setAccessToken] = useState("");
  const [currentSong, setCurrentSong] = useState("");
  const [myInfo, setMyInfo] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [deviceID, setDeviceID] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.hash.substring(1));
    const token = params.get("access_token");
    console.log(token);
    if (!token) {
      setAccessToken("No access token");
      return;
    }
    setAccessToken(token);
  }, [location]);

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
    }, 1000);

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
            if (jsonData?.device?.id){
                setDeviceID(jsonData.device.id)
            }
        });
    };

    cacheDevice();
    console.log("DEVICE:", deviceID)
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
    setIsPlaying(true);
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
    });
    setIsPlaying(true);
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

  return (
    <div className=" font-bold bg-[#0c0d14]">
      {/* <div className=" absolute m-4">
        <h1>{myInfo?.display_name}</h1>
        <img src={myInfo?.images?.[0].url} className=" h-32 w-32"></img>
      </div> */}
      <div className=" absolute w-[100vw] h-[100vh] flex">
        <img
          src={currentSong?.item?.album?.images?.[0]?.url}
          className=" m-4"
        ></img>
      </div>
      <div className=" h-[100vh] flex flex-col justify-center">
        <div className=" flex  justify-center bg-gradient-to-r from-[#1DB954]/60 to-[#0c0d14]/0 p-12 mx-32 rounded-2xl backdrop-blur-md">
          <div className="  w-[60vh]">
            {currentSong?.item?.album?.images?.[0] ? (
              <img
                src={currentSong?.item?.album?.images?.[0]?.url}
                className=" w-full rounded-lg"
              ></img>
            ) : (
              <div className=" skeleton h-[60vh] w-full"></div>
            )}

            {currentSong?.item?.name && (
              <h1 className="  text-white text-3xl font-medium">
                {currentSong?.item?.name}
              </h1>
            )}
            <h2 className="  text-white text-xl font-thin">
              {currentSong?.item?.artists.map((a) => a?.name).join(", ")}
            </h2>
            <progress
              className="progress progress-success w-full"
              value={
                ((currentSong?.progress_ms || 0) * 100) /
                currentSong?.item?.duration_ms
              }
              max="100"
            ></progress>
            <div className=" flex justify-center">
            <button onClick={prev} className=" p-4 text-white text-3xl"><FaFastBackward></FaFastBackward></button>
              {isPlaying ? (
                <button onClick={pause} className=" p-4 text-white text-3xl">
                  <FaPause></FaPause>
                </button>
              ) : (
                <button onClick={play} className=" p-4 text-white text-3xl">
                  <FaPlay></FaPlay>
                </button>
              )}
              <button onClick={next} className=" p-4 text-white text-3xl"><FaFastForward></FaFastForward></button>
            </div>
          </div>

          <div className=" ml-4">
            <h1 className=" text-white text-3xl font-bold mb-2 underline">
              Up next ...
            </h1>
            {currentQueue?.queue?.map((song, i) => {
              return (
                <p className=" text-white text-sm font-md">
                  {i}. {song.name}
                </p>
              );
            })}
          </div>
          <div className=" w-96 h-full flex flex-col justify-center items-center">
            <div className=" border-8 border-white rounded-md">
              <QRCode
                value={`http://localhost:3000/queue/#access_token=${accessToken}`}
                className=" border-12 border-white "
                size={256}
              ></QRCode>
            </div>
            <h1 className=" text-white font-medium text-2xl mt-4">
              Add to Queue
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
