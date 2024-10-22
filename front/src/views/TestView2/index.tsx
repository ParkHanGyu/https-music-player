// YouTubeInfo.tsx
import React, { useState } from "react";
import "./style.css"; // CSS 파일 import

interface YoutubeInfo {
  id: string | null;
  vid_url: string | null;
  author: string | null;
  thumb: string | null;
  vid_title: string | null;
}

const noEmbed = "https://noembed.com/embed?url=";
const urlForm = "https://www.youtube.com/watch?v=";

const TestView2: React.FC = () => {
  const [youtube, setYoutube] = useState<YoutubeInfo>({
    id: null,
    vid_url: null,
    author: null,
    thumb: null,
    vid_title: null,
  });
  const [inputValue, setInputValue] = useState<string>("JFQOgt5DMBY");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue) {
      getInfo(inputValue);
    }
  };

  const getInfo = (id: string) => {
    const fullUrl = noEmbed + urlForm + id;
    fetch(fullUrl)
      .then((res) => res.json())
      .then((data) => {
        setInfo(data);
      });
  };

  const setInfo = (data: any) => {
    const { url, author_name, thumbnail_url, title } = data;
    setYoutube({
      id: inputValue,
      vid_url: url || null,
      author: author_name || null,
      thumb: thumbnail_url || null,
      vid_title: title || null,
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="이곳에 유튭 아이디를 넣어봐"
        />
        <button type="submit">검색</button>
      </form>

      {youtube.vid_url && (
        <div className="result-container">
          <a href={youtube.vid_url} target="_blank" rel="noopener noreferrer">
            {youtube.thumb && (
              <img src={youtube.thumb} alt={youtube.vid_title || ""} />
            )}
            <div className="result-title">{youtube.vid_title}</div>
            <span className="result-author">by {youtube.author}</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default TestView2;
