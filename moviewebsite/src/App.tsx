import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom' // HashRouter로 변경
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
    {/* HashRouter는 basename 없이도 모든 링크와 새로고침이 정상 동작합니다 */}
    <HashRouter>
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
      </Routes>
    </HashRouter>
  </StrictMode>,
)