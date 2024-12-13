// YouTubeInfo.tsx
import React, { useState } from "react";
import styles from "./style.module.css";
import ReactPlayer from "react-player";
import { uploadProfileImageRequest } from "../../apis";
import { useCookies } from "react-cookie";
import ResponseDto from "../../apis/response/response.dto";

const TestView2 = () => {
  const [cookies, removeCookie, deleteCookie] = useCookies();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("파일을 선택하세요.");
      return;
    }

    uploadProfileImageRequest(file, cookies.accessToken).then(
      uploadProfileImageResponse
    );
  };

  const uploadProfileImageResponse = (responseBody: ResponseDto | null) => {
    if (!responseBody) {
      alert("데이터 없음");
      return;
    }

    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류");
    if (code !== "SU") {
      return false;
    }
    console.log("업로드 성공:");
    alert("업로드 성공: ");
  };

  return (
    <div>
      <h3>프로필 이미지 변경</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="미리보기" width={100} />}
      <button onClick={handleUpload}>업로드</button>
    </div>
  );
};
export default TestView2;
