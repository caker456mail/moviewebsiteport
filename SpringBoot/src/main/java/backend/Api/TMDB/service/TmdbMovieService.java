package backend.Api.TMDB.service;

import backend.Api.TMDB.domain.TmdbMovie;
import backend.Api.TMDB.dto.TmdbMovieDto;
import backend.Api.TMDB.repository.TmdbMovieRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.List;

@Slf4j
@Service
public class TmdbMovieService {

    private final TmdbMovieRepository tmdbMovieRepository;
    private final RestClient restClient;

    @Value("${tmdb.api.key}")
    private String apiKey;

    public TmdbMovieService(TmdbMovieRepository tmdbMovieRepository) {
        this.tmdbMovieRepository = tmdbMovieRepository;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.themoviedb.org/3")
                .build();
    }

    @Scheduled(cron = "0 0 4 * * *", zone = "Asia/Seoul")
    public void scheduleDailyMovieSync() {
        log.info("[TMDB Sync] 새벽 4시 정기 영화 데이터 동기화 시작");
        try {
            int nowPlayingCount = syncMoviesByCategory("now_playing", "NOW_PLAYING");
            int upcomingCount = syncMoviesByCategory("upcoming", "UPCOMING");
            log.info("[TMDB Sync] 동기화 완료: NOW_PLAYING={}건, UPCOMING={}건", nowPlayingCount, upcomingCount);
        } catch (Exception e) {
            log.error("[TMDB Sync] 영화 데이터 동기화 중 오류 발생: {}", e.getMessage(), e);
        }
    }

    // 진입점 메서드에 @Transactional 추가
    @Transactional
    public int syncMoviesByCategory(String endpoint, String status) {
        TmdbMovieDto.Response response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + endpoint)
                        .queryParam("api_key", apiKey)
                        .queryParam("language", "ko-KR")
                        .queryParam("page", 1)
                        .build())
                .retrieve()
                .body(TmdbMovieDto.Response.class);

        if (response == null || response.getResults() == null || response.getResults().isEmpty()) {
            return 0;
        }

        saveMovieBatch(response.getResults(), status);
        return response.getResults().size();
    }

    public void saveMovieBatch(List<TmdbMovieDto.MovieItem> items, String status) {
        for (TmdbMovieDto.MovieItem item : items) {
            TmdbMovie movie = item.toEntity(status);
            tmdbMovieRepository.upsert(movie);
        }
    }
}