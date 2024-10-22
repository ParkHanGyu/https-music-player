import { Outlet } from "react-router-dom";
import Menu from "../Menu";
import MusicInfo from "../MusicInfo";

const Container = () => {
  return (
    <>
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
    </>
  );
};

export default Container;
