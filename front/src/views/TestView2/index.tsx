import { useState } from "react";
import styles from "./style.module.css";
import "../TestView2/testStyle.css";

type PlaylistItem = {
  id: number;
  title: string;
  description: string;
};

const TestView2 = () => {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([
    { id: 1, title: "Track 1", description: "Artist 1" },
    { id: 2, title: "Track 2", description: "Artist 2" },
    { id: 3, title: "Track 3", description: "Artist 3" },
    { id: 4, title: "Track 4", description: "Artist 4" },
  ]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 드래그 시작
  const handleDragStart = (index: number) => {
    console.log("드래그 시작");
    setDraggedIndex(index);
  };

  // 드래그 중
  const handleDragEnter = (index: number) => {
    console.log("드래그 중");

    setHoveredIndex(index);

    if (draggedIndex !== null && draggedIndex !== index) {
      const updatedPlaylist = [...playlist];
      const [draggedItem] = updatedPlaylist.splice(draggedIndex, 1);
      updatedPlaylist.splice(index, 0, draggedItem);

      setPlaylist(updatedPlaylist);
      setDraggedIndex(index);
    }
  };

  // 드래그 종료
  const handleDragEnd = () => {
    console.log("드래그 종료");

    setDraggedIndex(null);
    setHoveredIndex(null);
    console.log("Target Position:", hoveredIndex);
  };

  const testBtn = () => {};

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <h2>Playlist</h2>
      <div>
        {playlist.map((item, index) => (
          <div
            className="testDiv1"
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            style={{
              backgroundColor:
                draggedIndex === index
                  ? "rgb(0, 0, 0)" // 드래그 중 배경색
                  : hoveredIndex !== null && hoveredIndex === index // hoveredIndex가 null이 아닌 경우만 비교
                  ? "#a71919" // 드래그 중인 아이템이 다른 아이템 위로 들어갔을 때 배경색
                  : "#fff", // 기본 배경색
            }}
          >
            <div>
              <strong>{item.title}</strong>
              <p style={{ margin: 0 }}>{item.description}</p>
            </div>
          </div>
        ))}

        <div onClick={testBtn}>test btn</div>
      </div>
    </div>
  );
};
export default TestView2;
