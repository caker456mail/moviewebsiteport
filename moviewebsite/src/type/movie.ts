export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  genre: string[];
  runningTime: number;
  rating: string;
}

export interface BookingState {
  movieId: number | null;
  seatNumber: string[];
  totalPrice: number;
}
