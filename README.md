# 모두의 질문 카드

GitHub Pages에서 동작하는 정적 카드 모음입니다. CNAME: card.questionschool.net.

- `oneword.html`: 올해의 한 단어. 이름·별칭 입장, 2026·2027 단어 기록, 공개 목록과 하트 지지.
- `oneword/`: 올해의 한 단어 정적 자산과 공유 썸네일.
- `backend/oneword/`: 구글 시트 DB용 Apps Script 코드와 운영 안내.
- `value.html`: 기존 오늘의 가치카드. 기존 파일과 이미지를 유지합니다.
- `work/index.html`: 일터 경험 나눔 15개 질문.
- `school/index.html`: 학교생활 나눔 15개 질문.
- `experience/`: 두 모드의 공용 JavaScript, CSS, 삽화, 모드별 공유 썸네일과 QR 이미지.

모든 앱은 ChatGPT 로그인·구독 없이 HTML/CSS/JavaScript로 실행됩니다. 올해의 한 단어 기록은 공개 Google Apps Script API를 사용하며, 나머지 앱에는 서버 API가 필요하지 않습니다.
처음 보이는 카드를 1장으로 계산하며, 각 모드의 15번 질문은 첫 세 장에서 제외하고 네 번째부터 뽑을 수 있습니다.

로컬 확인: `python3 -m http.server 4173`.
검증: `node --check experience/app.js`, `node --test tests/draw-order.test.cjs`.
QR 이미지는 `/work/`, `/school/`의 독립 도메인 주소로 연결됩니다.
