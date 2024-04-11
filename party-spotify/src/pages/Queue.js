import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Queue = () => {
  const location = useLocation();
  const [accessToken, setAccessToken] = useState("");

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


  return <div>Queue {accessToken}</div>;
};
