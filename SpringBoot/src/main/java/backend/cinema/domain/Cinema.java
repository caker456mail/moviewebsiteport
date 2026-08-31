package backend.cinema.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(schema = "admin",name = "cinema")
public class Cinema
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cinema_id;

    @Column(name = "cinema_name" , length = 50)
    private String cinemaName;

    @Column(name = "cinema_location", length = 100)
    private String cinemaLocation;

    @Column(name = "cinema_img",length = 255)
    private  String cinemaImg;
}