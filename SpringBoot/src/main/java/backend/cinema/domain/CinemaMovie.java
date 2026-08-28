//package backend.cinema.domain;
//
//import jakarta.persistence.*;
//import lombok.AccessLevel;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//
//@Entity
//@Table(name = "cinema_movie", schema = "admin")
//@Getter
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//public class CinemaMovie {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "screening_date")
//    private LocalDate screeningDate;
//
//    @Column(name = "screening_time")
//    private LocalTime screeningTime;
//
//    @Column(name = "theater_name")
//    private String theaterName;
//
//    @Column(name = "is_gv", length = 1)
//    private String isGv;
//
//    @Column(name = "is_lecture", length = 1)
//    private String isLecture;
//
//    @Column(name = "is_performance", length = 1)
//    private String isPerformance;
//
//    @Column(name = "is_event", length = 1)
//    private String isEvent;
//
//    @Column(name = "screening_mgmt_id")
//    private String screeningMgmtId;
//
//    @Column(name = "program_mgmt_id")
//    private String programMgmtId;
//
//    @Column(name = "screening_title")
//    private String screeningTitle;
//
//    @Column(name = "screening_desc", columnDefinition = "TEXT")
//    private String screeningDesc;
//
//    @Column(name = "length_type")
//    private String lengthType;
//
//    @Column(name = "screening_media")
//    private String screeningMedia;
//
//    @Column(name = "prod_year")
//    private Integer prodYear;
//
//    @Column(name = "running_time_min")
//    private Integer runningTimeMin;
//
//    @Column(name = "color_type")
//    private String colorType;
//
//    @Column(name = "aspect_ratio")
//    private String aspectRatio;
//
//    @Column(name = "director")
//    private String director;
//
//    @Column(name = "director_en")
//    private String directorEn;
//
//    @Column(name = "actor", columnDefinition = "TEXT")
//    private String actor;
//
//    @Column(name = "actor_en", columnDefinition = "TEXT")
//    private String actorEn;
//
//    @Column(name = "rating")
//    private String rating;
//
//    @Column(name = "section_name")
//    private String sectionName;
//
//    @Column(name = "section_name_en")
//    private String sectionNameEn;
//
//    @Column(name = "movie_reg_no_1")
//    private String movieRegNo1;
//
//    @Column(name = "movie_reg_no_2")
//    private String movieRegNo2;
//
//    @Column(name = "speaker")
//    private String speaker;
//
//    @Column(name = "speaker_en")
//    private String speakerEn;
//
//    @Column(name = "access_path", columnDefinition = "TEXT")
//    private String accessPath;
//
//    @Column(name = "program_name")
//    private String programName;
//
//    @Column(name = "program_desc", columnDefinition = "TEXT")
//    private String programDesc;
//
//    @Column(name = "short_title")
//    private String shortTitle;
//
//    @Column(name = "short_title_en")
//    private String shortTitleEn;
//
//    @Column(name = "short_running_time_min")
//    private Integer shortRunningTimeMin;
//
//    @Column(name = "short_prod_year")
//    private Integer shortProdYear;
//
//    @Column(name = "short_director")
//    private String shortDirector;
//}