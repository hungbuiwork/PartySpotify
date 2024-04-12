import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Callback = () => {
    //DOES NOT WORK FOR NOW! THIS IS FOR SLIENT SECRET STUFF TOO
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    console.log("URL", location);
    console.log("CODE", code);
    if (code) {
      // Exchange the authorization code for an access token
      const CLIENT_ID = "1e38d15cb1a84430a78653561e1852cb";
      const CLIENT_SECRET =  "SECRET";

      // Concatenate client ID and client secret with a colon
      const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
      // Encode the concatenated string to Base64
      const base64Credentials = btoa(credentials);

      const requestBody = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:3000/callback/",
      });
      fetch(
        `https://accounts.spotify.com/api/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${base64Credentials}`,
          },
          body: requestBody.toString(),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const accessToken = data.access_token;
          const refreshToken = data.refresh_token;
          const expiresIn = data.expires_in;
          console.log(accessToken);
          console.log(refreshToken);
          console.log(expiresIn);

        })
        .catch((error) => {
          console.error("Error fetching access token:", error);
        });
    }
  });
  return <div>Callback</div>;
};
