"use client";

import { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export default function Home() {
  const [mantra, setMantra] = useState("");
  const [count, setCount] = useState(0);
  const [mala, setMala] = useState(0);
  const [lastSpoken, setLastSpoken] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // Normalize text for accurate comparison
  const normalize = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true; // ✅ IMPORTANT
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spokenText =
        event.results[event.results.length - 1][0].transcript;

      setLastSpoken(spokenText);

      if (normalize(spokenText) === normalize(mantra)) {
        setCount((prev) => {
          const newCount = prev + 1;

          if (newCount === 108) {
            setMala((m) => m + 1);
            alert("🙏 Mala Completed!");
            return 0;
          }

          return newCount;
        });
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
    };

    recognition.onend = () => {
      // 🔁 Auto-restart ONLY if user hasn't stopped it
      if (listening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [mantra, listening]);

  const startListening = () => {
    if (!mantra.trim()) {
      alert("Please enter a mantra");
      return;
    }
    if (!recognitionRef.current) return;

    setListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setListening(false);
    recognitionRef.current?.stop();
  };


  return (
    <main className="app-container">
      <Card elevation={6}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            🕉️ Mantra Japa Counter
          </Typography>

          <TextField
            label="Mantra"
            value={mantra}
            onChange={(e) => setMantra(e.target.value)}
            fullWidth
            margin="normal"
          />

          <div className="button-group">
            <Button
              variant="contained"
              color="success"
              onClick={startListening}
            >
              Start
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={stopListening}
            >
              Stop
            </Button>
          </div>

          <div className="info-section text-center">
            <Typography variant="body2">
              <strong>Last Spoken:</strong> {lastSpoken || "-"}
            </Typography>

            <Typography variant="h6">
              {count} / 108
            </Typography>

            <Typography variant="body1">
              Mala Completed: <strong>{mala}</strong>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
