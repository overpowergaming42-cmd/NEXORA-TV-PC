import React, { useEffect, useState } from "react";
import { DEFAULT_CHANNELS } from "./data";
import { db, trackVisit } from "./firebase";
import { Channel, EventData } from "./types";
import { HomeView } from "./components/HomeView";
import { PlayerView } from "./components/PlayerView";

export default function App() {
  const [channelsData, setChannelsData] = useState<Channel[]>(DEFAULT_CHANNELS);
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [eventData, setEventData] = useState<EventData>({
    title: "🏆 ফিফা বিশ্বকাপ ২০২৬ পরবর্তী ম্যাচ 🏆",
    desc: "Germany vs Ivory Coast ⏲️রাত ২ টা",
    url: "https://live.wxinxi.com/live/25816724_sb2maw7iluj1ghr92sk5siud28tpimx0.m3u8",
  });

  useEffect(() => {
    trackVisit();

    const unsubscribe = db
      .collection("nexora")
      .doc("appData")
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data() as any;
          console.log("📦 ইউজার: ডাটা এলো", data);
          if (data.channels && data.channels.length > 0) {
            setChannelsData(data.channels);
          } else {
            setChannelsData(DEFAULT_CHANNELS);
          }
          if (data.event) {
            setEventData(data.event);
          }
        }
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handlePlayChannel = (channel: Channel) => {
    setCurrentChannel(channel);
  };

  const handleBackHome = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setCurrentChannel(null);
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {!currentChannel ? (
        <HomeView
          eventData={eventData}
          channels={channelsData}
          currentCategory={currentCategory}
          setCategory={setCurrentCategory}
          onPlayChannel={handlePlayChannel}
        />
      ) : (
        <PlayerView
          channel={currentChannel}
          channels={channelsData}
          onBack={handleBackHome}
          onPlayChannel={handlePlayChannel}
        />
      )}

      <div className="ad-bottom">
        <div id="adContainer" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
          <iframe 
            src="/ad.html"
            style={{ border: 'none', width: '100%', height: '90px', margin: '0 auto', display: 'block', overflow: 'hidden' }} 
            title="Advertisement"
            sandbox="allow-scripts allow-popups allow-same-origin allow-top-navigation-by-user-activation"
          />
        </div>
      </div>

      <footer>© Nexora Tv Pc | সর্বস্বত্ব সংরক্ষিত</footer>
    </div>
  );
}
