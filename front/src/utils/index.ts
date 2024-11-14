export const ResponseUtil = (responseBody: any) => {
  if (!responseBody) {
    alert("네트워크 이상입니다.");
    return;
  }
  const { code } = responseBody;
  if (code === "VF") alert("유효성 검사 실패");
  if (code === "DBE") alert("데이터베이스 오류");
  if (code === "NU") alert("존재하지 않는 유저");
  if (code === "BR") alert("에러입니다.");
  if (code !== "SU") {
    return false;
  }
  return responseBody;
};
