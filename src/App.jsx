import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const USE_DEMO = true;
const CLIENT_ID = USE_DEMO ? null : import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = "http://localhost:5173";
const SCOPES = "https://www.googleapis.com/auth/youtube.force-ssl";

export default function StreamingApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [title, setTitle] = useState("Mein Livestream");
  const [description, setDescription] = useState("Beschreibung des Streams");
  const [date, setDate] = useState(new Date());
  const [accessToken, setAccessToken] = useState(null);
  const [obsStatus, setObsStatus] = useState("Nicht verbunden");

  useEffect(() => {
    if (!USE_DEMO) {
      const hash = window.location.hash;
      if (hash) {
        const token = new URLSearchParams(hash.replace("#", "")).get("access_token");
        if (token) {
          setAccessToken(token);
          setLoggedIn(true);
        }
      }
    }
  }, []);

  const handleLogin = () => {
    if (USE_DEMO) {
      setLoggedIn(true);
    } else {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES}&include_granted_scopes=true`;
      window.location.href = authUrl;
    }
  };

  const handleCreateStream = () => {
    if (USE_DEMO) {
      console.log("📝 Demo-Stream erstellt:", { title, description, date });
      alert("✅ Stream im Demo-Modus erstellt!");
    } else {
      if (!accessToken) return alert("🔒 Nicht eingeloggt");
      alert("🔧 YouTube Stream würde hier erstellt (API-Aufruf auskommentiert)");
    }
  };

  const handleOBSConnect = () => {
    setObsStatus("Demo: Verbindung hergestellt");
  };

  const handleOBSStart = () => {
    alert("🟢 OBS Stream gestartet (Demo-Modus)");
  };

  const handleSceneChange = (szene) => {
    alert(`🎬 OBS Szene gewechselt zu: ${szene}`);
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26 }}>🎥 {USE_DEMO ? "Demo-Modus" : "YouTube-Modus"}: Streaming Companion App</h1>

      {!loggedIn ? (
        <button onClick={handleLogin}>🔐 {USE_DEMO ? "Demo-Login starten" : "Mit Google anmelden"}</button>
      ) : (
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Stream-Titel" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          <div>📅 Datum: {format(date, 'dd.MM.yyyy')} um 20:00 Uhr</div>

          <button onClick={handleCreateStream}>✅ Stream erstellen</button>

          <h3>🎮 OBS-Steuerung (Demo)</h3>
          <div>Status: {obsStatus}</div>
          <button onClick={handleOBSConnect}>🔌 OBS verbinden</button>
          <button onClick={handleOBSStart}>🟢 Stream starten</button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            <button onClick={() => handleSceneChange("Intro")}>🎬 Intro</button>
            <button onClick={() => handleSceneChange("Gameplay")}>🕹️ Gameplay</button>
            <button onClick={() => handleSceneChange("Pause")}>⏸️ Pause</button>
            <button onClick={() => handleSceneChange("Outro")}>🏁 Outro</button>
          </div>
        </div>
      )}
    </div>
  );
}