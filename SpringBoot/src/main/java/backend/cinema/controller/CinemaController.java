//package backend.cinema.controller;
//
//import backend.cinema.service.CinemaService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
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