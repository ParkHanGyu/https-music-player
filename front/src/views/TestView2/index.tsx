// YouTubeInfo.tsx
import React, { useState } from "react";
import styles from "./style.module.css";
import ReactPlayer from "react-player";
import { uploadProfileImageRequest } from "../../apis";
import { useCookies } from "react-cookie";
import ResponseDto from "../../apis/response/response.dto";
import useLoginUserStore from "../../store/login-user.store";
import GetUserImageResponseDto from "../../apis/response/user/get-user-new-image-url.dto";

const TestView2 = () => {
  const [cookies] = useCookies();
  // 추가
  const { loginUser, setLoginUser } = useLoginUserStore();

  // const [file, setFile] = useState<File | null>(null);
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // setFile(selectedFile);
      // 미리기보기 필요시 사용
      // setPreviewUrl(URL.createObjectURL(selectedFile));

      // 파일이 선택되었을 때 바로 업로드 함수 호출
      await handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile: File) => {
    if (!selectedFile) {
      alert("파일을 선택하세요.");
      return;
    }
    uploadProfileImageRequest(selectedFile, cookies.accessToken).then(
      uploadProfileImageResponse
    );
  };
  const uploadProfileImageResponse = (
    responseBody: GetUserImageResponseDto | ResponseDto | null
  ) => {
    console.log("서버에서 받은 데이터 : ", responseBody);
    if (!responseBody) {
      alert("데이터 없음");
      return;
    }

    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류");
    if (code !== "SU") {
      return false;
    }
    const profileImage = responseBody as GetUserImageResponseDto;
    if (loginUser) {
      setLoginUser({
        ...loginUser,
        profileImage: profileImage.url, // 새 URL로 업데이트
      });
    }
  };

  const handleClick = () => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    fileInput?.click(); // 숨겨진 파일 입력창 클릭
  };
  return (
    <div>
      {/* <h3>프로필 이미지 변경</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} /> */}
      {/* <button onClick={handleUpload}>업로드</button> */}

      {/* <label
        htmlFor="input-file" // form -> htmlFor로 수정
        style={{
          display: "inline-block", // display를 inline-block으로 설정
          width: "100px",
          height: "100px",
          backgroundColor: "#f0f0f0", // 테스트용 배경색 추가
          textAlign: "center", // 텍스트 중앙 정렬
          lineHeight: "100px", // 높이에 맞춰 텍스트 세로 중앙 정렬
          border: "1px solid #ccc", // 테두리 추가
          cursor: "pointer", // 마우스 커서 변경
        }}
      >
        업로드
      </label>
      <input
        type="file"
        accept="image/*"
        id="input-file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      /> */}

      <div
        onClick={handleClick}
        style={{
          width: "200px",
          height: "200px",
          border: "2px dashed #ccc",
          borderRadius: "10px",
          backgroundImage: loginUser?.profileImage
            ? `url(${loginUser.profileImage})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: "pointer",
        }}
      ></div>

      <input
        type="file"
        id="file-input"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};
export default TestView2;
