package backend.cinema.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*" )
public class CinemaController{
    private  final CinemaService cinemaService;
    @GetMapping("/cinemalist.do")
    public Re
}
//
//@RestController
//@RequiredArgsConstructor
//@CrossOrigin( origins = "http://localhost:5173", allowedHeaders = "*" )
//public class CinemaController{
//    private final CinemaService cinemaService;
//    @GetMapping("/cinemainfo.do")
//    public ResponseEntity<List<String>> getTheaterNames() {
//        return ResponseEntity.ok(
//                cinemaService.getTheaterNames()
//        );
//    }
//}