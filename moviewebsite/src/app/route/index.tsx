import { BrowserRouter, Routes, Route } from "react-router-dom";
import { main } from "../../page/MainPage"
import { Booking } from "../../page/booking/page";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<main />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
};