import React, { useEffect, useRef, useState, useMemo } from "react";
import Hls from "hls.js";
import { Channel } from "../types";

interface PlayerViewProps {
  channel: Channel;
  channels: Channel[];
  onBack: () => void;
  onPlayChannel: (channel: Channel) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  channel,
  channels,
  onBack,
  onPlayChannel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    if (channel.url.includes("youtube.com/embed")) {
      setLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let loadingTimeout = setTimeout(() => {
      setError(true);
      setLoading(false);
    }, 15000);

    const cleanupHls = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };

    cleanupHls();

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        clearTimeout(loadingTimeout);
        setLoading(false);
        video.play().catch(() => console.log("Auto-play prevented"));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          clearTimeout(loadingTimeout);
          setLoading(false);
          setError(true);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.url;
      video.addEventListener("loadedmetadata", () => {
        clearTimeout(loadingTimeout);
        setLoading(false);
        video.play().catch(() => console.log("Auto-play prevented"));
      });
      video.addEventListener("error", () => {
        clearTimeout(loadingTimeout);
        setLoading(false);
        setError(true);
      });
    }

    return () => {
      clearTimeout(loadingTimeout);
      cleanupHls();
    };
  }, [channel.url]);

  const suggestions = useMemo(() => {
    const others = channels.filter((ch) => ch.name !== channel.name);
    return [...others].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [channel.name, channels]);

  return (
    <div className="player-mode">
      <div className="player-area">
        <div className="player-header">🎬 এখন চলছে: {channel.name}</div>
        <div className="video-wrapper">
          {channel.url.includes("youtube.com/embed") ? (
            <iframe
              src={channel.url}
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
            ></iframe>
          ) : (
            <>
              {loading && <div className="loading-text">⏳ লোড হচ্ছে...</div>}
              {error && (
                <div className="error-text">
                  ❌ লোড করতে সমস্যা<br />
                  <small>আবার চেষ্টা করুন</small>
                </div>
              )}
              <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                style={{
                  display: loading || error ? "none" : "block",
                  width: "100%",
                  height: "100%",
                  background: "#000",
                  outline: "none",
                  objectFit: "contain",
                }}
              />
            </>
          )}
        </div>
      </div>

      <div className="suggestions-section">
        <div className="suggestions-header">
          <h3>
            🎯 <span>আরও দেখুন</span>
          </h3>
          <button
            className="home-back-btn"
            onClick={onBack}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onBack();
              }
            }}
          >
            🏠 হোমে ফিরুন
          </button>
        </div>
        <div className="suggestions-grid">
          {suggestions.map((sugg, idx) => (
            <div
              key={idx}
              className="suggestion-card"
              tabIndex={0}
              onClick={() => onPlayChannel(sugg)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPlayChannel(sugg);
                }
              }}
            >
              <img
                src={sugg.logo}
                alt={sugg.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/60";
                }}
              />
              <div className="suggestion-name">{sugg.name}</div>
              <div className="live-badge-small">লাইভ</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
