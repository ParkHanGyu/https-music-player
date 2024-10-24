import { Outlet } from "react-router-dom";
import Menu from "../Menu";
import MusicInfo from "../MusicInfo";
import PlayBar from "../PlayBar";
import { useState } from "react";

const Container = () => {
  const [globalVideoUrl, setGlobalVideoUrl] = useState<string | null>(null);
  return (
    <>
      <div className="warp">
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <Menu />
          <Outlet context={{ setGlobalVideoUrl }} />
          {/* <MusicInfo /> */}
        </div>
        <PlayBar />
      </div>
    </>
  );
};

export default Container;
