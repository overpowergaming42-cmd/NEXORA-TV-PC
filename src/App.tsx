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
        <div id="adContainer">
          <iframe 
            srcDoc={`<!DOCTYPE html>
              <html>
              <head>
              <script>
                window.onerror = function(e) { return true; };
              </script>
              <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }</style>
              </head>
              <body>
              <script type="text/javascript">
                  var atOptions = {
                      'key' : '7bc66073f87704a3289310f1cc22aa75',
                      'format' : 'iframe',
                      'height' : 90,
                      'width' : 728,
                      'params' : {}
                  };
              </script>
              <script type="text/javascript" src="https://criminaldissolved.com/7bc66073f87704a3289310f1cc22aa75/invoke.js"></script>
              </body>
              </html>`}
            style={{ border: 'none', width: '100%', maxWidth: '728px', height: '90px' }} 
            title="Advertisement"
            sandbox="allow-scripts allow-popups allow-same-origin"
          />
        </div>
      </div>

      <footer>© Nexora Tv Pc | সর্বস্বত্ব সংরক্ষিত</footer>
    </div>
  );
}
