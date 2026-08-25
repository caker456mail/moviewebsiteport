type LocationData = Record<string, Record<string, string[]>>;

export const MOVIES = [
  { id: 1, title: "오디세이", bg: "#1a2a3a", desc: "크리스토퍼 놀란 감독이 선사하는 압도적인 마스터피스", genre: "SF" },
  { id: 2, title: "스파이더맨: 브랜드 뉴 데이", bg: "#0d3b4c", desc: "화려한 시각 효과와 다이내믹한 올여름 최고의 액션 블록버스터", genre: "액션" },
  { id: 3, title: "호프", bg: "#3a2a1a", desc: "나홍진 감독이 선보이는 밀도 높은 숨막히는 SF 스릴러", genre: "스릴러" },
  { id: 4, title: "인시디어스: 그들이 넘어왔다", bg: "#2c2c2c", desc: "여름 막바지 극장가를 얼려버릴 극강의 공포 미스터리", genre: "공포" },
  { id: 5, title: "사랑의 하츄핑: 고래보석의 전설", bg: "#4a1a1a", desc: "가족 관객과 어린이들을 사로잡은 최고의 하츄핑 애니메이션", genre: "애니메이션" },
  { id: 6, title: "인터스텔라", bg: "#1a2a3a", desc: "시공간을 초월한 최첨단 SF 대작", genre: "SF / 169분" },
  { id: 7, title: "아바타: 물의 길", bg: "#0d3b4c", desc: "판도라 행성의 신비로운 수중 세계", genre: "액션 / 192분" },
  { id: 8, title: "파묘", bg: "#3a2a1a", desc: "험한 것이 나왔다 - 오컬트 미스터리", genre: "스릴러 / 134분" },
  { id: 9, title: "오펜하이머", bg: "#2c2c2c", desc: "세상을 바꾼 천재 과학자의 이야기", genre: "전기 / 180분" },
  { id: 10, title: "범죄도시 4", bg: "#4a1a1a", desc: "괴물형사 마석도의 액션 빅매치", genre: "액션 / 109분" },
];

export const CINEMA_LOCATIONS: Record<string, LocationData> = {
  CGV: {
    서울: ["강남구", "마포구"],
    "경기/인천": ["안산시 단원구", "수원시 팔달구"],
  },
  메가박스: {
    서울: ["강남구", "마포구"],
    "경기/인천": ["안산시 단원구", "수원시 팔달구"],
  },
  롯데시네마: {
    서울: ["광진구", "노원구"],
    "경기/인천": ["안산시 단원구", "안산시 상록구", "수원시 권선구"],
  },
  씨네Q: {
    서울: ["구로구"],
    "경기/인천": ["성남시 분당구", "남양주시"],
  },
};
export const CINEMAS = ["CGV", "메가박스", "롯데시네마", "씨네Q"];
export const TIME_SLOTS = ["10:30", "13:45", "16:30", "19:15", "22:00"];
export const ROWS = ["A", "B", "C", "D", "E"];
export const PRICE_PER_SEAT = 15000;

export const UPCOMING_MOVIES = [
  {
    id: 101,
    title: "아바타 3",
    releaseDate: "2026.12.18",
    genre: "SF / 액션",
  },
  {
    id: 102,
    title: "어벤져스: 도둠스데이",
    releaseDate: "2026.05.01",
    genre: "액션 / 히어로",
  },
  {
    id: 103,
    title: "겨울왕국 3",
    releaseDate: "2026.11.25",
    genre: "애니메이션",
  },
  {
    id: 104,
    title: "스파이더맨 4",
    releaseDate: "2026.07.24",
    genre: "액션 / SF",
  },
];