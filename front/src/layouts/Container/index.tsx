import { Outlet } from "react-router-dom";
import Menu from "../Menu";
import MusicInfo from "../MusicInfo";
import PlayBar from "../PlayBar";
import { useState } from "react";

const Container = () => {
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
          <Outlet />
          <MusicInfo />
        </div>
        <PlayBar />
      </div>
    </>
  );
};

export default Container;
