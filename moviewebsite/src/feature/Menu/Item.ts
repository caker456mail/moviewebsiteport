export interface MenuItemType {
  id: number;
  name: string;
  hidden?: boolean;
  path: string;
}

// 💡 함수 형태로 만들어 호출 시마다 최신 권한을 체크합니다.
export const getMenuItems = (): MenuItemType[] => {
  const savedUser = localStorage.getItem("user");
  const userdata = savedUser ? JSON.parse(savedUser) : null;

  const menuList: MenuItemType[] = [
    { id: 1, name: "홈", path: "/" },
    { id: 2, name: "영화목록", path: "/movie" },
    { id: 3, name: "문의하기", path: "/quest" },
    { id: 4, name: "이벤트", path: "/event" },
  ];

  // 💡 userRole이 ADMIN인 경우에만 관리자모드 추가
  if (userdata?.userRole === "ADMIN") {
    menuList.push({ id: 5, name: "관리자모드", path: "/admin" });
  }

  return menuList;
};