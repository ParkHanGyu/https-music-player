import React, { useState } from "react";
import axios from "axios";

const TestView2: React.FC = () => {
  const [oEmbedUrl, setOEmbedUrl] = useState("");
  const [noEmbedUrl, setNoEmbedUrl] = useState("");

  const [oEmbedResult, setOEmbedResult] = useState<any>(null);
  const [noEmbedResult, setNoEmbedResult] = useState<any>(null);

  const [oEmbedError, setOEmbedError] = useState<string | null>(null);
  const [noEmbedError, setNoEmbedError] = useState<string | null>(null);

  const fetchOEmbed = async () => {
    setOEmbedError(null);
    setOEmbedResult(null);

    try {
      let endpoint = "";
      if (oEmbedUrl.includes("youtube.com") || oEmbedUrl.includes("youtu.be")) {
        endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
          oEmbedUrl
        )}&format=json`;
      } else if (oEmbedUrl.includes("soundcloud.com")) {
        endpoint = `https://soundcloud.com/oembed?url=${encodeURIComponent(
          oEmbedUrl
        )}&format=json`;
      } else {
        setOEmbedError("지원하지 않는 oEmbed URL입니다.");
        return;
      }

      const res = await axios.get(endpoint);
      setOEmbedResult(res.data);
    } catch (err) {
      setOEmbedError("oEmbed 정보 가져오기 실패");
    }
  };

  const fetchNoEmbed = async () => {
    setNoEmbedError(null);
    setNoEmbedResult(null);

    try {
      const endpoint = `https://noembed.com/embed?url=${encodeURIComponent(
        noEmbedUrl
      )}`;
      const res = await axios.get(endpoint);
      setNoEmbedResult(res.data);
    } catch (err) {
      setNoEmbedError("noEmbed 정보 가져오기 실패");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>oEmbed vs noEmbed 비교</h2>

      {/* oEmbed 영역 */}
      <div
        style={{
          border: "1px solid gray",
          padding: "20px",
          marginBottom: "30px",
          color: "white",
        }}
      >
        <h3>🎯 oEmbed</h3>
        <input
          type="text"
          value={oEmbedUrl}
          onChange={(e) => setOEmbedUrl(e.target.value)}
          placeholder="YouTube 또는 SoundCloud URL 입력"
          style={{ width: "400px", marginRight: "10px" }}
        />
        <button onClick={fetchOEmbed}>oEmbed 가져오기</button>
        {oEmbedError && <p style={{ color: "red" }}>{oEmbedError}</p>}
        {oEmbedResult && (
          <div style={{ marginTop: "20px" }}>
            <p>
              <strong>Title:</strong> {oEmbedResult.title}
            </p>
            <p>
              <strong>Author:</strong> {oEmbedResult.author_name}
            </p>
            <div dangerouslySetInnerHTML={{ __html: oEmbedResult.html }} />
          </div>
        )}
      </div>

      {/* noEmbed 영역 */}
      <div
        style={{ border: "1px solid gray", padding: "20px", color: "white" }}
      >
        <h3>🎯 noEmbed</h3>
        <input
          type="text"
          value={noEmbedUrl}
          onChange={(e) => setNoEmbedUrl(e.target.value)}
          placeholder="지원되는 URL 입력 (YouTube, SoundCloud 등)"
          style={{ width: "400px", marginRight: "10px" }}
        />
        <button onClick={fetchNoEmbed}>noEmbed 가져오기</button>
        {noEmbedError && <p style={{ color: "red" }}>{noEmbedError}</p>}
        {noEmbedResult && (
          <div style={{ marginTop: "20px" }}>
            <p>
              <strong>Title:</strong> {noEmbedResult.title}
            </p>
            <p>
              <strong>Author:</strong> {noEmbedResult.author_name}
            </p>
            <p>
              <strong>Provider:</strong> {noEmbedResult.provider_name}
            </p>
            <div dangerouslySetInnerHTML={{ __html: noEmbedResult.html }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestView2;
