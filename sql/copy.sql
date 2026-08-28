set search_path to admin;
--테이블 생성 삭제
drop table movies;

-- 1. 기존 PK(기본키) 제약조건 삭제
ALTER TABLE admin.movies DROP CONSTRAINT movies_pkey;

-- 2. ★ [핵심] 기존 BIGSERIAL 시퀀스 DEFAULT 설정 삭제
ALTER TABLE admin.movies ALTER COLUMN movie_id DROP DEFAULT;

-- 3. movie_id 컬럼 타입을 UUID로 변경 (기존 데이터에는 무작위 UUID 할당)
ALTER TABLE admin.movies 
  ALTER COLUMN movie_id TYPE UUID USING gen_random_uuid();

-- 4. 앞으로 새로 들어올 데이터에 자동 UUID 생성 DEFAULT 설정
ALTER TABLE admin.movies 
  ALTER COLUMN movie_id SET DEFAULT gen_random_uuid();

-- 5. 다시 movie_id를 PK(기본키)로 지정
ALTER TABLE admin.movies ADD PRIMARY KEY (movie_id);


--테이블 생성 

CREATE TABLE admin.movies (
    movie_id         BIGSERIAL PRIMARY KEY,  -- 내부 고유 ID
    title_kr            VARCHAR(255) NOT NULL,  -- 영화명
    title_en   VARCHAR(255),           -- 영화명(영문)
    movie_year     INT,                    -- 제작연도
    movie_location           VARCHAR(50),           -- 국가
    movie_type       VARCHAR(50),            -- 유형
    movie_genre            VARCHAR(100),           -- 장르
    movie_active VARCHAR(25),
	movie_director         VARCHAR(255),           -- 감독
    movie_company          VARCHAR(100)            -- 제작사
	image_url VARCHAR(255)
);


--테이블 콮



COPY admin.movies (
    title_kr,
    title_en,
    movie_year,
    movie_location,
    movie_type,
    movie_genre,
    movie_active,
    movie_director,
    movie_company
)
FROM 'D:/SQL/data.csv'
WITH (
    FORMAT csv,
    HEADER false,
    DELIMITER ',',
    QUOTE '"',
    ENCODING 'WIN949'
);

alter table users
rename column role to user_role;

SELECT COUNT(*) FROM movies;
select * from movies;
select * from users;	



UPDATE users SET user_role = 'ADMIN'
WHERE user_role = 'USER' AND email = 'caker456@naver.com';