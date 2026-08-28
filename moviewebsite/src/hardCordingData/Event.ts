 // 이벤트 데이터 타입 정의
 export interface EventItem {
   id: number;
   category: "시사회/무대인사" | "영화/예매" | "제휴/혜택" | "기타";
   title: string;
   subtitle: string;
   period: string;
   imageUrl: string;
   isEnded: boolean;
   content: string; // 상세 모달용 설명 내용
 }
 
 export const events: EventItem[] = [
    {
      id: 1,
      category: "시사회/무대인사",
      title: "🎬 [오디세이] 개봉기념 감독 & 주연배우 최초 무대인사",
      subtitle: "개봉 첫 주 주말! 감독과 주요 배우들을 직접 만나보세요.",
      period: "2026.08.20 ~ 2026.08.31",
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      isEnded: false,
      content: "영화 <오디세이> 개봉을 기념하여 배우진의 무대인사가 진행됩니다.\n\n- 일시: 2026년 8월 30일(일) 14:00 상영 후\n- 장소: CGV 1관\n- 참석자: 감독 및 주연 배우진\n\n* 본 행사는 예매 고객 대상 자동 응모 및 무대인사 전용 회차 예매로 진행됩니다.",
    },
    {
      id: 2,
      category: "영화/예매",
      title: "🎟️ 심야영화 5,000원 할인 스페셜 쿠폰 패키지",
      subtitle: "밤 10시 이후 상영작 전용! 더 시원하게 영화를 즐기는 방법",
      period: "2026.08.01 ~ 2026.09.15",
      imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80",
      isEnded: false,
      content: "열대야를 잊게 만들 심야영화 쿠폰 혜택!\n\n- 할인쿠폰: 5,000원 할인권 2매\n- 대상 회차: 22:00 이후 상영 시작 영화\n- 쿠폰 다운로드: 내 쿠폰함에서 즉시 발급 가능",
    },
    {
      id: 3,
      category: "제휴/혜택",
      title: "🥤 콤보 50% 할인! 신한/KB카드 매주 금요일 혜택",
      subtitle: "매주 금요일, 카드 제휴 결제 시 팝콘+음료 콤보 반값!",
      period: "2026.07.01 ~ 2026.12.31",
      imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80",
      isEnded: false,
      content: "금요일엔 극장 매점에서 카드 할인받으세요!\n\n- 대상 카드: 신한카드, KB국민카드\n- 혜택: 러브콤보/반반콤보 구매 시 5% 현장 할인 + 45% 포인트 차감 할인\n- 일일 선착순 1,000명 한정",
    },
    {
      id: 4,
      category: "영화/예매",
      title: "🍿 8월의 VIP 회원 전용 무료 팝콘 릴레이",
      subtitle: "VIP 회원이라면 누구나 현장 매점에서 쿠폰 제시 시 팝콘(M) 증정!",
      period: "2026.08.01 ~ 2026.08.31",
      imageUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&auto=format&fit=crop&q=80",
      isEnded: false,
      content: "VIP 고객님만을 위한 8월 특별 혜택!\n\n- 대상: VIP 및 VVIP 등급 회원\n- 내용: 고소한맛 팝콘 M 사이즈 무료 바코드 발급\n- 마이페이지 > 쿠폰함에서 바코드를 제시해주세요.",
    },
    {
      id: 5,
      category: "시사회/무대인사",
      title: "🍿 [종료] 여름방학 애니메이션 특별 얼리버드 시사회",
      subtitle: "어린이 및 가족 관객을 위한 패밀리 시사회 현장 이벤트",
      period: "2026.07.10 ~ 2026.07.25",
      imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
      isEnded: true,
      content: "본 이벤트는 성황리에 종료되었습니다. 참여해주신 모든 분께 감사드립니다.",
    },
  ];