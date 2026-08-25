interface MenuItem {
  id: number;
  name: string;
  path: string; // 예: "#booking", "/booking", 또는 페이지 내 id값
}
export const MenuItem: MenuItem[] = [
  { id: 1, name: "홈", path: "/" },
  { id: 2, name: "영화평점", path: "/movie" },
  { id: 3, name: "", path: "/location" },
  { id: 4, name: "이벤트", path: "/event" },
  // 필요할 때 여기에 { id: 5, name: "커뮤니티", path: "#community" } 추가만 하면 끝!
];