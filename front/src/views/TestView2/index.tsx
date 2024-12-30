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
    setDraggedIndex(index);
  };

  // 드래그 중
  const handleDragEnter = (index: number) => {
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
    setDraggedIndex(null);
    setHoveredIndex(null);
  };

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <h2>Playlist</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        {playlist.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              margin: "5px 0",
              backgroundColor:
                draggedIndex === index
                  ? "rgb(0, 0, 0)" // 드래그 중 배경색
                  : hoveredIndex !== null && hoveredIndex === index // hoveredIndex가 null이 아닌 경우만 비교
                  ? "#a71919" // 드래그 중인 아이템이 다른 아이템 위로 들어갔을 때 배경색
                  : "#fff", // 기본 배경색
              borderRadius: "5px",
              transition: "all 0.2s ease", // 부드러운 효과
            }}
          >
            <div>
              <strong>{item.title}</strong>
              <p style={{ margin: 0 }}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TestView2;
