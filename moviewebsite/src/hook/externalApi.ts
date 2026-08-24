import { NextRequest } from "next/server";

// 1. 환경 변수에서 Base URL 가져오기 (기본값 설정 포함)
export const EXTERNAL_BASE_URL =
  process.env.NEXT_PUBLIC_SPRING_BASE_URL || "http://localhost:8080/api";

export const OPTIMAL_ROUTE_BASE_URL =
  process.env.NEXT_PUBLIC_NODE_BASE_URL || "http://localhost:5001/api";

const isDevelopment = process.env.NODE_ENV === "development";

// 개발 환경 정보 로깅
if (isDevelopment) {
  console.log("🔧 API 설정 완료:", {
    EXTERNAL_BASE_URL,
    OPTIMAL_ROUTE_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
}

// 2. 타입 정의
export interface ExternalApiConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  sessionId?: string; // 세션 ID
  timeout?: number; // 타임아웃 설정 (밀리초)
  request?: NextRequest;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 3. Spring Boot 백엔드 API 호출 함수
 */
export async function callExternalApi(
  endpoint: string,
  config: ExternalApiConfig = {}
): Promise<{ data: unknown; contentType: string | null }> {
  const {
    method = "GET",
    headers = {},
    body,
    params = {},
    sessionId,
    timeout = 30 * 1000, // 기본 30초 타임아웃
  } = config;

  // 세션 쿠키 설정
  let sessionCookie = "";
  if (sessionId) {
    sessionCookie = `JSESSIONID=${sessionId}`;
  }

  // URL 쿼리 파라미터 처리
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(key, String(value));
    }
  });

  const queryString = urlParams.toString();
  const externalUrl = `${EXTERNAL_BASE_URL}/${endpoint}${
    queryString ? `?${queryString}` : ""
  }`;

  // 최종 헤더 구성
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(sessionCookie && { Cookie: sessionCookie }),
    ...headers,
  };

  console.log("🚀 External API 호출:", { method, url: externalUrl, body });

  // 타임아웃 설정을 위한 AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const requestConfig: RequestInit = {
    method,
    headers: finalHeaders,
    signal: controller.signal,
  };

  if (method !== "GET" && body) {
    requestConfig.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(externalUrl, requestConfig);
    clearTimeout(timeoutId);

    console.log("📥 External API 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ External API 에러:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return { data, contentType };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`API 호출 타임아웃 (${timeout / 1000}초)`);
    }

    throw error;
  }
}

/**
 * 4. Node.js 백엔드 API 호출 함수 (좌석/실시간 서비스)
 */
export async function callOptimalRouteApi(
  endpoint: string,
  config: ExternalApiConfig = {}
): Promise<ApiResponse> {
  try {
    const url = `${OPTIMAL_ROUTE_BASE_URL}/${endpoint}`;
    const method = config.method || "GET";

    const headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    console.log("🚀 Node API 호출 URL:", url);

    const response = await fetch(url, {
      method,
      headers,
      body: config.body ? JSON.stringify(config.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Node API 호출 실패 (${endpoint}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 5. CORS 헤더 생성 유틸리티
 */
export function createCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}