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
    console.log("TestView2에서 api 호출시 보내는 file 값 : ", file);

    uploadProfileImageRequest(file, cookies.accessToken).then(
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
    console.log("업로드 성공:");
    alert("업로드 성공: ");

    // if (loginUser) {
    //   setLoginUser({
    //     ...loginUser,
    //     profileImage: profileImage, // 새 URL로 업데이트
    //   });
    // }

    // 여기서 uploadProfileImageResponse에서 받아온 값을 LoginUser에 profileImage 부분에 넣어주려함
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
