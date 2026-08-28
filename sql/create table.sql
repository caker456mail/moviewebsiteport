SET search_path TO admin;

drop table users;

create table users(
	-- 기본키: UUID 방식 사용 시 (gen_random_uuid() 활용)
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- 기본 계정 정보
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    birth_date DATE ,
    -- 권한 및 상태
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DELETED')),
    -- 소셜 로그인 정보
    auth_provider VARCHAR(20) DEFAULT 'LOCAL', -- LOCAL, KAKAO, NAVER 등
    social_id VARCHAR(255),
    -- 시간 정보 (타임존 포함 추천)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMPTZ
);

