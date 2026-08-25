import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

interface TheaterTree {
  [wideArea: string]: {
    [basArea: string]: string[];
  };
}

async function scrapeAllKobisTheaters() {
  console.log('🚀 KOBIS 전국 영화상영관 전체 크롤링을 시작합니다...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    // KOBIS 상영스케줄 페이지 접속
    await page.goto('https://www.kobis.or.kr/kobis/business/mast/thea/findTheaterSchedule.do', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // 브라우저 내부에서 실시간 DOM 트리를 순회하여 수집
    const resultTree: TheaterTree = await page.evaluate(async () => {
      const tree: TheaterTree = {};

      // 1. 광역 목록 가져오기 (#wideAreaList 하위 li)
      const wideItems = Array.from(document.querySelectorAll('#wideAreaList li, .area_list li'));

      for (const wideEl of wideItems) {
        const wideName = wideEl.textContent?.trim();
        if (!wideName) continue;

        tree[wideName] = {};

        // 광역 클릭
        (wideEl as HTMLElement).click();
        await new Promise((res) => setTimeout(res, 400));

        // 2. 기초 구/군 목록 가져오기 (#basAreaList 하위 li)
        const basItems = Array.from(document.querySelectorAll('#basAreaList li, .bas_list li'));

        for (const basEl of basItems) {
          const basName = basEl.textContent?.trim();
          if (!basName) continue;

          // 기초 클릭
          (basEl as HTMLElement).click();
          await new Promise((res) => setTimeout(res, 400));

          // 3. 영화상영관 목록 전체 추출 (#theaList 하위 li)
          const theaterItems = Array.from(document.querySelectorAll('#theaList li, .theater_list li'));
          const theaterNames = theaterItems
            .map((t) => t.textContent?.trim())
            .filter((t): t is string => Boolean(t) && t !== '조회된 상영관이 없습니다.');

          tree[wideName][basName] = theaterNames;
        }
      }

      return tree;
    });

    // 결과 저장
    const outputPath = path.join(__dirname, 'kobisTheaters.json');
    fs.writeFileSync(outputPath, JSON.stringify(resultTree, null, 2), 'utf-8');

    console.log(`✅ 수집 완료! 파일이 생성되었습니다: ${outputPath}`);
  } catch (error) {
    console.error('❌ 수집 중 오류 발생:', error);
  } finally {
    await browser.close();
  }
}

scrapeAllKobisTheaters();