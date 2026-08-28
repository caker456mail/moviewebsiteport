import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // 1. 라우터 불러오기
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 3. BrowserRouter 및 Routes 설정 */}
    <BrowserRouter>
      <Routes>
        {/* / 주소 접속 시 MainPage */}
        <Route path="/" element={<MainPage />} />

        <Route path="/movie/info/:id" element={<MovieInfo />} />
        {/* /event 주소 접속 시 EventPage */}
        <Route path="/movie" element={<Movie />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/event" element={<Event />} />
        <Route path="/quest" element={<Quest />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)