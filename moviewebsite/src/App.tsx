import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import MainPage from './page/MainPage'
import Movie from './page/movie/page'
import Login from './page/login/page'
import Register from './page/register/page'
import Profile from './page/profile/page';
import Admin from './page/admin/page';
import Event from './page/event/page';
import Quest from './page/quest/page';
import MovieInfo from './page/movie/info/page';
import Menu from './components/Menu'
import Footer from './components/Footer'
import PaymentPopup from './page/PaymentPopup'
import PopupSuccess from './page/PopupSuccess'
import KakaoCallback from './page/login/kakao/page'

function AppRoutes() {
  const location = useLocation();
  // 현재 URL이 /payment-popup으로 시작하면 true
  const isPaymentPopup = location.pathname.startsWith('/payment-popup');

  return (
    <>
      {/* 팝업 창이 아닐 때만 Menu 렌더링 */}
      {!isPaymentPopup && <Menu />}

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/movie/info/:id" element={<MovieInfo />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/event" element={<Event />} />
        <Route path="/quest" element={<Quest />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        
        {/* 팝업 라우트를 동일한 Routes 안에 배치 */}
        <Route path="/payment-popup" element={<PaymentPopup />} />
        <Route path="/popup-success" element={<PopupSuccess />} />
      </Routes>

      {/* 팝업 창이 아닐 때만 Footer 렌더링 */}
      {!isPaymentPopup && <Footer />}
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
)