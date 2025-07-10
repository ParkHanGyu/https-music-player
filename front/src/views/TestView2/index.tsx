import React, { useState } from "react";
import axios from "axios";

const TestView2 = () => {
  const [url, setUrl] = useState("");
  const [mediaInfo, setMediaInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOEmbed = async () => {
    try {
      let oEmbedUrl = "";

      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
          url
        )}&format=json`;
      } else if (url.includes("soundcloud.com")) {
        oEmbedUrl = `https://soundcloud.com/oembed?url=${encodeURIComponent(
          url
        )}&format=json`;
      } else {
        setError("지원하지 않는 URL입니다.");
        setMediaInfo(null);
        return;
      }

      const response = await axios.get(oEmbedUrl);
      setMediaInfo(response.data);
      console.log(JSON.stringify(response.data, null, 2));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("미디어 정보를 가져오는 데 실패했습니다.");
      setMediaInfo(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>oEmbed 미디어 정보 가져오기</h2>
      <input
        type="text"
        value={url}
        placeholder="YouTube 또는 SoundCloud URL 입력"
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px", marginRight: "10px" }}
      />
      <button onClick={fetchOEmbed}>가져오기</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {mediaInfo && (
        <div style={{ marginTop: "20px" }}>
          <h3>{mediaInfo.title}</h3>
          <p>작성자: {mediaInfo.author_name}</p>
          {/* oEmbed에서 제공하는 HTML을 직접 렌더링 */}
          <div dangerouslySetInnerHTML={{ __html: mediaInfo.html }} />
        </div>
      )}
    </div>
  );
};

export default TestView2;
