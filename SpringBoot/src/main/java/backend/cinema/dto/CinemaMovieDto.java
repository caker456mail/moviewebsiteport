package backend.cinema.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CinemaMovieDto{
    private Long cinema_id;
    private String cinemaName;
    private String cinemaLocation;
    private  String cinemaImg;
}


