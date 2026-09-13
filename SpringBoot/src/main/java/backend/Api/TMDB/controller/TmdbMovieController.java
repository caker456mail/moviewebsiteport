package backend.Api.TMDB.controller;

import backend.Api.TMDB.service.TmdbMovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin/movies")
@RequiredArgsConstructor
public class TmdbMovieController {

    private final TmdbMovieService tmdbMovieService;

    // 브라우저 주소창(GET)으로 바로 호출 테스트할 수 있게 추가
    @GetMapping("/sync")
    public ResponseEntity<Map<String, Object>> manualSyncGet() {
        return manualSync();
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> manualSync() {
        int nowPlayingCount = tmdbMovieService.syncMoviesByCategory("now_playing", "NOW_PLAYING");
        int upcomingCount = tmdbMovieService.syncMoviesByCategory("upcoming", "UPCOMING");

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "TMDB 영화 데이터 동기화가 완료되었습니다.",
                "syncedCounts", Map.of(
                        "NOW_PLAYING", nowPlayingCount,
                        "UPCOMING", upcomingCount
                )
        ));
    }
}