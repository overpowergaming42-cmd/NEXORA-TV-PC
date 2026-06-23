import React from "react";
import { Channel, EventData } from "../types";

interface HomeViewProps {
  eventData: EventData;
  channels: Channel[];
  currentCategory: string;
  setCategory: (cat: string) => void;
  onPlayChannel: (channel: Channel) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  eventData,
  channels,
  currentCategory,
  setCategory,
  onPlayChannel,
}) => {
  const filteredChannels =
    currentCategory === "all"
      ? channels
      : channels.filter((ch) => ch.category === currentCategory);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      bangladeshi: "বাংলাদেশি",
      international: "আন্তর্জাতিক",
      entertainment: "বিনোদন",
      islamic: "ইসলামিক",
      sports: "স্পোর্টস",
      kids: "কিডস",
    };
    return labels[cat] || cat;
  };

  const categories = [
    { id: "all", label: "সব" },
    { id: "bangladeshi", label: "🇧🇩 বাংলাদেশি" },
    { id: "international", label: "🌍 আন্তর্জাতিক" },
    { id: "entertainment", label: "🎬 বিনোদন" },
    { id: "islamic", label: "🕌 ইসলামিক" },
    { id: "sports", label: "⚽ স্পোর্টস" },
    { id: "kids", label: "🧒 কিডস" },
  ];

  const handleEventClick = () => {
    onPlayChannel({
      name: eventData.title,
      logo: "https://via.placeholder.com/70",
      category: "event",
      url: eventData.url,
    });
  };

  return (
    <div className="home-mode">
      <h1>Nexora Tv Pc</h1>

      <div
        className="event-banner"
        tabIndex={0}
        role="button"
        onClick={handleEventClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleEventClick();
          }
        }}
      >
        <div className="event-title">{eventData.title}</div>
        <div className="event-desc">{eventData.desc}</div>
        <div className="event-live">🔴 লাইভ</div>
      </div>

      <div className="category-selector">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`cat-btn ${currentCategory === cat.id ? "active" : ""}`}
            onClick={() => setCategory(cat.id)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setCategory(cat.id);
              }
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="channels-grid">
        {filteredChannels.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#FFD700",
              padding: "40px",
              gridColumn: "1/-1",
            }}
          >
            এই ক্যাটাগরিতে কোনো চ্যানেল নেই
          </div>
        ) : (
          filteredChannels.map((ch, idx) => (
            <div
              key={idx}
              className="channel-card"
              tabIndex={0}
              onClick={() => onPlayChannel(ch)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPlayChannel(ch);
                }
              }}
            >
              <img
                src={ch.logo}
                alt={ch.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/70";
                }}
              />
              <div className="channel-name">{ch.name}</div>
              <div className="channel-category">
                {getCategoryLabel(ch.category)}
              </div>
              <div className="live-badge">লাইভ</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
