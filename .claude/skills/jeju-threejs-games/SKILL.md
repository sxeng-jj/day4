---
name: jeju-threejs-games
description: day4 프로젝트(제주도 테마 three.js 단일 HTML 앱·게임 모음)를 수정하거나 새 게임/장면을 추가할 때 사용. 파일 구성, 공통 코드 패턴(three.js CDN, 절차적 모델, 파티클, WebAudio, 한국어 음성), 검증 방법, 이미 겪은 버그와 해결법을 담고 있다.
---

# 제주 three.js 게임 모음 (day4)

작업 폴더 `C:\vibe\mange\day4`, 원격 `https://github.com/sxeng-jj/day4.git` (`main`). 모든 앱은 **빌드 없이 단일 HTML 파일**이며 브라우저로 바로 연다.
푸시는 사용자가 요청했을 때만 한다 (커밋 메시지 끝에 시스템이 지정한 Co-Authored-By 줄을 붙인다).

## 파일 구성
| 파일 | 내용 |
|---|---|
| `index.html` | 제주 미니어처 섬 다이오라마 (한라산·성산일출봉·유채꽃·감귤농장·돌하르방·풍력·해녀 배). `AnimationMixer` 키프레임, `RoomEnvironment`, 하단 카드 UI(More → 카메라 이동). 왼쪽 아래에 다른 앱으로 가는 배지 버튼(`#race`, `#game`, `#space`) |
| `space.html` | 태양계 + 우주선이 경로(CatmullRom)를 따라 도는 장면, 카메라 추적 토글(C) |
| `game.html` | **감귤이의 폴짝 대모험** — 자동 전진 3D 점프 러너 |
| `race.html` | **제주 그랑프리** — 레이스카, 1인(AI 3대)/2인 화면 분할 |
| `.claude/skills/jeju-threejs-games/` | 이 스킬 |

## 공통 규칙
- three.js는 CDN importmap: `three@0.160.0` (`https://unpkg.com/three@0.160.0/build/three.module.js`, addons는 `three/addons/` → `examples/jsm/`). 외부 3D 모델·이미지·오디오 파일은 쓰지 않는다. 모양은 프리미티브로, 텍스처는 `canvas`로, 소리는 WebAudio로 만든다.
- 글꼴: Google Fonts `Jua`(제목), `Noto Sans KR`(본문). 팔레트: 갈색 `#4a2f1f`, 주황 `#ff8a1f`/`#e8962e`, 빨강 `#d9534f`.
- 한국어 UI·한국어 음성. 새 게임이면 `index.html`에 배지 링크를 추가하고(위치: `bottom`을 64px씩 올림), 게임 쪽에는 돌아가기 링크를 둔다.
- 창이 작은 미리보기에서도 보이도록 `clamp()`/`min()`으로 크기를 잡는다. 모바일은 가능하면 화면 버튼 제공(game.html은 있음, race.html은 키보드 전용).

## 재사용 패턴
- **하늘 돔**: `SphereGeometry` + `ShaderMaterial`(BackSide, `fog:false`)로 horizon→top 그라데이션. 매 프레임 카메라/플레이어 위치로 옮긴다. 안개색 = 배경색 = 돔 아래색으로 맞춘다.
- **파티클**: `Points` + 링버퍼(`emit(x,y,z,color,count,speed,life,gravity,vx,vy,vz)`), `AdditiveBlending`, 수명에 비례해 색을 줄여 페이드. 속도선·연기·불꽃·폭발을 모두 이걸로 처리.
- **키프레임**: `play(obj, tracks, duration, phase)` 헬퍼 + `AnimationMixer`. 경로 이동은 `VectorKeyframeTrack('.position')` + `QuaternionKeyframeTrack('.quaternion')`, 날갯짓은 피벗 그룹에 회전 트랙.
- **UI 레이어**: 캔버스에 `position:fixed; z-index:0`, 모든 HUD/오버레이는 `z-index` ≥ 2를 명시한다.
- **플랫폼/바닥 겹침 방지**: 두께 있는 박스와 얇은 덮개가 같은 높이면 줄무늬가 생긴다. 한쪽을 0.02~0.04 낮춘다.
- **블룸**(game.html만): `EffectComposer` + `RenderPass` + `UnrealBloomPass` + `OutputPass`. 화면 분할(race.html)에서는 쓰지 않는다(뷰포트별 렌더가 필요).
- **화면 분할**: `renderer.setScissorTest(true)` 후 플레이어마다 `setViewport/setScissor/render`. HUD는 뷰포트와 같은 위치의 `div`. 가로 화면이면 좌우, 세로 화면이면 상하.

## 오디오·음성 패턴
- `initAudio()`는 **사용자 클릭(시작 버튼) 안에서** 호출해야 소리가 난다. 마스터/음악/효과음(/엔진) 게인을 분리하고 음소거는 마스터 게인으로 처리.
- 효과음은 `tone(freq, time, {type, vol, delay, f2})`(오실레이터 스윕)와 `noise(time, vol, f0, f1, {type})`(필터 노이즈) 두 함수 조합.
- 배경음악은 `setInterval(40ms)` 룩어헤드 스케줄러 + 펜타토닉 선율/베이스/킥/햇/스네어 (game 132 BPM, race 150 BPM). 일시정지 중엔 스케줄을 건너뛴다.
- 음성은 `speechSynthesis` (`lang='ko-KR'`, 한국어 voice 탐색, 시작 시 `getVoices()` 한 번 호출). `say(text,{prio})`: 일반 대사는 2~2.6초 쿨다운, `prio`는 `cancel()` 후 즉시. **같은 문장을 화면 자막/말풍선에도 표시**한다(한국어 음성이 없는 기기 대비). 🔊/🗣 토글 제공.
- 대사는 이벤트 중심: 출발, 점프(확률), 피격, 콤보 마일스톤, 아이템 획득, 스테이지 전환, 추월·충돌·마지막 바퀴·피니시 등.

## game.html 핵심 구조
- 상태: `menu → play → countdown(목숨 잃을 때 3초) → play … → over`, `paused`.
- 월드는 24m 청크(평지/틈새/징검다리/휴식)를 앞에서 생성하고 뒤에서 제거. 난이도 `d=min(1,dist/2500)`. 스테이지는 900m마다(유채꽃 들판 → 현무암 해안 → 한라산 눈꽃길) 색·장식이 부드럽게 바뀐다.
- 캐릭터 감귤이는 얼굴이 **카메라 쪽(+z)** 을 보게 만들어 뒷모습이 아니라 얼굴이 보인다. 폴짝 = `|sin|` 바운스 + 스쿼시/스트레치, 더블점프 시 한 바퀴 회전.
- 점프 감각: 중력 34, 점프 13.5/2단 11.5, 키를 일찍 떼면 추가 중력으로 낮은 점프.
- 아이템: 🍊감귤(콤보 배수·대시 게이지), 🍈한라봉(방어막), 🌼유채꽃(자석), 테왁(대시 충전). 대시는 무적+장애물 박살.
- 테스트용 훅: `window.__game = { G, P, startGame, tryJump, tryDash, input }`.

## race.html 핵심 구조
- 트랙: 14개 제어점 `CatmullRomCurve3`(닫힘, centripetal) → `getSpacedPoints(720)`. 샘플별 접선 `T`, 왼쪽 법선 `NN`, 곡률 `CURV`. 도로/연석/벽은 `ribbon()`으로 생성. 차의 `heading h`는 `f=(sin h, cos h)`, 왼쪽=`(cos h, -sin h)`(=`NN`), `steer>0`이 좌회전.
- 진행도 `prog`는 최근접 샘플 ±25 탐색 + 래핑 보정으로 누적. 출발선은 prog 0, 그리드는 음수에서 시작, `3*N`에 도달하면 피니시.
- 물리: 종/횡속도 분해, 횡방향 감쇠(그립 9, 풀밭 5)로 드리프트 느낌, 풀밭은 최고속 55%, 벽 충돌은 법선 성분 반사+감속. 부스터 패드/니트로는 최고속 ×1.4, 가속 ×2.4.
- AI: 전방 룩어헤드 지점으로 조향, 전방 곡률로 목표 속도, 사람과의 격차에 따른 러버밴딩. 피니시한 사람 차는 자동주행으로 전환.
- 입력: 1P `WASD`+`Shift/Space`, 2P 방향키+`Enter`(1인 모드는 둘 다 1P). `P`/`Esc` 일시정지.
- 테스트용 훅: `window.__race = { R, cars, players, startRace, KEYS }` (예: `startRace(2)` 후 `KEYS.KeyW=true`).

## 검증 절차 (매번)
1. 브라우저 패널로 `file:///C:/vibe/mange/day4/<파일>.html` 열기 → 3~4초 대기(CDN 로딩) → 스크린샷.
2. `read_console_messages(onlyErrors)`로 오류 확인.
3. `javascript_tool`로 `window.__game`/`__race` 훅을 써서 시작·입력·상태를 시뮬레이션하고 수치(상태, 거리, 목숨 등)를 확인한 뒤 스크린샷.
4. 소리/음성은 직접 들을 수 없으므로 **확인하지 못했다고 사용자에게 명시**한다.

## 이미 겪은 문제 (재발 방지)
- HUD가 캔버스 뒤에 가려짐 → 오버레이에 `z-index` 지정.
- 판 위의 줄무늬(z-fighting) → 두께 박스와 덮개의 높이를 어긋나게.
- 화면 흔들림이 카운트다운·게임오버에서 멈추지 않음 → 감쇠를 `update()`가 아니라 카메라 갱신(모든 상태에서 실행되는 곳)에 둔다. 세기는 낮게(피격 0.35, 배율 0.25).
- 무적 중 낭떠러지에 떨어지면 목숨이 안 깎이고 무한 추락 → 추락은 무적을 무시하고 처리.
- 부활이 너무 빨라 알아보기 어려움 → 목숨을 잃으면 월드를 멈추고 3초 카운트다운(3·2·1·GO!, 남은 목숨 표시), 그동안 캐릭터는 깜빡이지 않고 제자리에서 폴짝.
- 캐릭터가 멀어서 빛에 묻힘 → 추적 카메라 거리 6.2/높이 3.3, 몸체 emissive 낮게(0.2).
- 사용자가 "수정 하나만" 같이 범위를 좁히면 그 범위만 고치고, 눈에 띈 별개 버그는 같이 고친 사실을 알린다.

## 새 게임을 추가할 때 체크리스트
1. 단일 HTML, 위 CDN importmap, 제주 소재(감귤·한라산·돌하르방·해녀·유채꽃·현무암·오름·성산일출봉).
2. 시작 버튼에서 `initAudio()`, 효과음+BGM+한국어 음성+자막, 🔊/🗣 토글.
3. 일시정지(P), 창 크기 대응, 모바일이면 터치 버튼.
4. 테스트 훅을 `window`에 노출하고 위 검증 절차를 수행.
5. `index.html`에 배지 링크 추가, 게임에는 돌아가기 링크.
6. 푸시는 요청받았을 때만.
