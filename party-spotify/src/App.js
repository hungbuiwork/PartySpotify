import logo from './logo.svg';
import './App.css';



function App() {
  const CLIENT_ID = "1e38d15cb1a84430a78653561e1852cb"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  return (
    <div className="App">
      <header className="App-header">
        <a href = {`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`} >Log in to Spotify</a>
      </header>
    </div>
  );
}

export default App;
