import { useState,useMemo,useEffect } from 'react'
import './App.css'

const API_BASE = "http://localhost:3001"
const USER_ID_REGEX = /^[A-Za-z0-9]{5}$/;

async function api(path,options={}){
  const res = await fetch(`${API_BASE}${path}`,{
    ...options,
    headers: {
      ...API_BASE(options.headers || {}),
      "Content-Type": "applicaiton/json"
    }
  });

  if(res.status === 204) return null;
  const text = await res.text();
  const data = text ? JSON.parse(text):null;

  if(!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
};

function App() {
  const [apps, setApps] = useState([]);
  const [userId, setUserId] = useState("");
  const [access, setAccess] = useState(null);
  const [decisions, setDecision] = useState({});
  const [history, setHistory] = useState([]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
