package backend.cinema.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CinemaService{
    private final CinemaRepositiory cinemaRepositiory;
}


//package backend.cinema.service;
//
//
//import backend.cinema.repository.CinemaRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class CinemaService{
//    private final CinemaRepository cinemaRepository;
//    public List<String> getTheaterNames(){
//        return cinemaRepository.findDistinctTheaterNames();
//    }
//}