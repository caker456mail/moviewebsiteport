// src/service/kakaoAuth.ts
export const getKakaoUserProfile = async (accessToken: string) => {
    const response = await fetch("https://kapi.kakao.com/v2/user/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
    });

    if (!response.ok) {
        throw new Error("사용자 정보를 가져오는데 실패했습니다.");
    }

    const data = await response.json();
    return {
        id: data.id,
        nickname: data.kakao_account?.profile?.nickname,
        profileImage: data.kakao_account?.profile?.profile_image_url,
        email: data.kakao_account?.email,
    };
}; 
export const kakaoLogout = async (accessToken: string) => {
    const response = await fetch("https://kapi.kakao.com/v1/user/logout", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        // 프론트엔드 스토리지(localStorage 등)에 저장된 사용자 세션 및 토큰 삭제
        localStorage.removeItem("accessToken");
    }
};

export const kakaoUnlink = async (accessToken: string) => {
  const response = await fetch("https://kapi.kakao.com/v1/user/unlink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    // DB 사용자 탈퇴 처리 및 로컬 세션 초기화
    localStorage.clear();
  }
};