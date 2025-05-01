import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import "../TestView2/testStyle.css";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import ReactPlayer from "react-player";

type PlaylistItem = {
  id: number;
  title: string;
  description: string;
};

const TestView2 = () => {
  const [rafX, setRafX] = useState(0); // requestAnimationFrame 위치
  const [intervalX, setIntervalX] = useState(0); // setInterval 위치

  const rafRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🎯 requestAnimationFrame 애니메이션
  useEffect(() => {
    const animate = () => {
      setRafX((prev) => {
        if (prev < 500) return prev + 2;
        else return prev;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // 🎯 setInterval 애니메이션
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIntervalX((prev) => (prev < 500 ? prev + 2 : prev));
    }, 16); // 약 60fps

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ padding: "50px" }}>
      <div style={{ marginBottom: "20px" }}>
        <strong>🌀 requestAnimationFrame 애니메이션</strong>
        <div
          style={{
            position: "relative",
            top: "10px",
            left: rafX,
            width: "50px",
            height: "50px",
            backgroundColor: "dodgerblue",
            transition: "none",
          }}
        />
      </div>

      <div>
        <strong>⏱ setInterval 애니메이션</strong>
        <div
          style={{
            position: "relative",
            top: "10px",
            left: intervalX,
            width: "50px",
            height: "50px",
            backgroundColor: "orange",
            transition: "none",
          }}
        />
      </div>
    </div>
  );
};

export default TestView2;
