# 모두의 질문 카드

GitHub Pages에서 동작하는 정적 카드 모음입니다. CNAME: card.questionschool.net.

- `value.html`: 기존 오늘의 가치카드. 기존 파일과 이미지를 유지합니다.
- `work/index.html`: 일터 경험 나눔 15개 질문.
- `school/index.html`: 학교생활 나눔 15개 질문.
- `experience/`: 두 모드의 공용 JavaScript, CSS, 삽화, 모드별 공유 썸네일과 QR 이미지.

빌드나 서버 API, ChatGPT 로그인 없이 HTML/CSS/JavaScript로 실행됩니다.
처음 보이는 카드를 1장으로 계산하며, 각 모드의 15번 질문은 첫 세 장에서 제외하고 네 번째부터 뽑을 수 있습니다.

로컬 확인: `python3 -m http.server 4173`.
검증: `node --check experience/app.js`, `node --test tests/draw-order.test.cjs`.
QR 이미지는 `/work/`, `/school/`의 독립 도메인 주소로 연결됩니다.
