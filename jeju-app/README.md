# 제주 감귤이 월드 (Vite + React + Supabase)

감귤이와 친구들이 사는 제주 IP 사이트. 이메일 회원가입/로그인(Supabase Auth)을 붙였고, 게임은 **로그인한 회원만** 플레이할 수 있어요. Vercel로 배포합니다.

- 프레임워크: Vite 5 + React 18 + react-router-dom 6
- 인증: Supabase Auth (이메일 + 비밀번호, 비밀번호 재설정 메일)
- 이미지: Pixabay 무료 이미지 9장 → `public/images/` (내려받아 사이트에 포함, 핫링크 아님)
- 게임: `public/games/*.html` (three.js 단일 HTML 5종) → 회원 전용 페이지에서 iframe 으로 실행

```
jeju-app/
├─ public/images/        Pixabay 제주 사진
├─ public/games/         게임 HTML (index/game/race/space/transformer)
├─ src/lib/supabase.js   Supabase 클라이언트 (환경변수 사용)
├─ src/context/AuthContext.jsx   로그인 상태/가입/로그인/로그아웃/재설정
├─ src/components/ProtectedRoute.jsx   로그인 필요 페이지 가드
├─ src/pages/            Home, Characters, Play, Game, Login, Signup, Forgot, Reset, Profile
└─ vercel.json           SPA 새로고침 대응(rewrite)
```

---

## 0. 필요한 것

| 환경변수 | 값 | 어디서 얻나 |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://orrnxnjcbpihberhalrg.supabase.co` | Supabase → Project Settings → API → **Project URL** |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` 로 시작하는 긴 문자열 | 같은 화면의 **anon public** 키 (새 UI에서는 *Publishable key*) |

> ⚠️ 반드시 **anon(public) 키**만 쓰세요. `service_role` 키는 서버 전용 비밀 키라서 브라우저 코드/Vercel의 `VITE_` 변수에 **절대** 넣으면 안 돼요.
> `VITE_` 로 시작하는 변수는 빌드 결과(JS)에 그대로 들어가 누구나 볼 수 있어요. anon 키는 공개돼도 되도록 설계된 키이고, 데이터 보호는 Supabase의 RLS(행 수준 보안)로 합니다.

---

## 1. Supabase 설정 (대시보드)

1. **키 복사**: 프로젝트 화면 왼쪽 아래 ⚙ **Project Settings → API**(또는 상단 초록색 **Connect** 버튼)에서 `Project URL`과 `anon public` 키를 복사해 둡니다.
2. **이메일 로그인 켜기**: **Authentication → Sign In / Providers → Email** 이 *Enabled* 인지 확인합니다. (기본값 켜짐)
3. **이메일 인증(Confirm email) 선택**
   - 켜 두면: 가입 후 메일의 링크를 눌러야 로그인됩니다. (실서비스 권장)
   - 끄면: 가입 즉시 로그인됩니다. (수업/테스트에 편함) → **Authentication → Sign In / Providers → Email → Confirm email** 토글.
   - 무료 플랜의 기본 메일 발송은 **시간당 발송 횟수 제한**이 작아요. 테스트가 막히면 Confirm email 을 잠시 끄세요.
4. **리다이렉트 주소 등록** — 이게 없으면 인증/재설정 메일 링크가 엉뚱한 곳으로 가요.
   **Authentication → URL Configuration**
   - **Site URL**: 배포 주소 (예: `https://내프로젝트.vercel.app`) — 3단계 Vercel 배포 후 알게 되면 다시 수정
   - **Redirect URLs** 에 추가:
     - `http://localhost:5173/**`
     - `https://내프로젝트.vercel.app/**`
5. (선택) **Authentication → Emails** 에서 인증/재설정 메일 문구를 한국어로 바꿀 수 있어요.

---

## 2. 내 컴퓨터에서 실행

Node.js 18 이상이 필요합니다. (https://nodejs.org → LTS)

```bash
cd jeju-app
npm install
cp .env.example .env.local      # Windows PowerShell: Copy-Item .env.example .env.local
# .env.local 을 열어 VITE_SUPABASE_ANON_KEY 를 실제 anon 키로 바꾸기
npm run dev                     # http://localhost:5173
```

- `.env.local` 은 `.gitignore` 에 들어 있어 GitHub에 올라가지 않아요.
- 환경변수를 바꾸면 `npm run dev` 를 **다시 실행**해야 반영돼요.
- 환경변수가 비어 있으면 화면 위에 노란 경고가 보이고 로그인/가입 버튼이 비활성화돼요.

**동작 확인**: 회원가입 → (메일 인증이 켜져 있으면 메일 링크 클릭) → 로그인 → `/me` 에서 닉네임 변경 → 게임 실행 → 로그아웃. 로그아웃 상태로 `/play/hop` 에 들어가면 로그인 화면으로 이동해야 해요.
Supabase 대시보드 **Authentication → Users** 에 가입한 사용자가 보이면 성공!

---

## 3. GitHub 에 올리기

이 저장소(`sxeng-jj/day4`)의 `jeju-app/` 폴더에 들어 있어요. (`.env.local` 은 올라가지 않음)

```bash
git add jeju-app
git commit -m "Add Jeju site (Vite + Supabase auth)"
git push
```

---

## 4. Vercel 배포

1. https://vercel.com 에 GitHub 계정으로 로그인 → **Add New… → Project**
2. `sxeng-jj/day4` 저장소 **Import**
3. **Configure Project** 화면에서
   - **Root Directory**: `jeju-app` 로 변경 ← 저장소 루트가 아니라 이 폴더가 앱이에요 (가장 많이 틀리는 부분)
   - **Framework Preset**: Vite (자동 인식)
   - Build Command `npm run build`, Output Directory `dist` (기본값 그대로)
4. 같은 화면의 **Environment Variables** 에 2개 추가 (Production/Preview/Development 모두 체크)
   - `VITE_SUPABASE_URL` = `https://orrnxnjcbpihberhalrg.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (anon public 키)
5. **Deploy**. 끝나면 `https://xxxx.vercel.app` 주소가 생겨요.
6. **Supabase로 돌아가** Authentication → URL Configuration 의 **Site URL / Redirect URLs** 를 그 주소로 수정 (1-4 단계).
7. 환경변수를 나중에 바꿨다면 Vercel **Deployments → ⋯ → Redeploy** 를 해야 반영돼요. (`VITE_` 변수는 빌드 때 들어가기 때문)

### 문제 해결

| 증상 | 원인 / 해결 |
|---|---|
| 배포 화면에 노란 경고 "환경변수가 설정되지 않아…" | Vercel 변수 이름 오타(`VITE_` 필수) 또는 변수 등록 후 **Redeploy** 안 함 |
| 빌드 실패: package.json not found | Root Directory 가 `jeju-app` 이 아님 |
| 가입 후 메일이 안 옴 | 스팸함 확인 / 무료 플랜 메일 제한 → Confirm email 끄고 테스트 |
| 메일 링크가 localhost 로 감 | Site URL / Redirect URLs 미설정 |
| `Invalid login credentials` | 이메일·비밀번호 불일치, 또는 메일 인증 전 |
| 새로고침하면 404 | `vercel.json` 의 rewrite 가 빠짐 (이 프로젝트엔 포함됨) |

---

## 5. 상점 · 장바구니 (Supabase 테이블)

1. Supabase **SQL Editor → New query** 에 [`supabase/cart.sql`](supabase/cart.sql) 전체를 붙여넣고 **Ctrl+Enter**.
   ("destructive operations" 경고는 `drop policy if exists` 때문이며 **Run this query** 를 눌러도 안전해요.)
2. **Table Editor** 에 `products`(샘플 8행)와 `cart_items`(0행)가 보이면 성공.
3. 사이트의 **상점**(`/shop`)에서 상품 담기 → **장바구니**(`/cart`, 로그인 필요)에서 수량 변경/삭제.

| 테이블 | 역할 | 보안(RLS) |
|---|---|---|
| `products` | 상품 목록 | 누구나 읽기만 가능 |
| `cart_items` | 회원별 장바구니 (`user_id`, `product_id`, `quantity`) | 로그인한 본인 행만 조회/추가/수정/삭제 |

- 같은 상품을 또 담으면 새 줄이 아니라 수량이 늘어나요 (`unique (user_id, product_id)`).
- 상품을 바꾸거나 추가하려면 Supabase **Table Editor → products** 에서 직접 수정하세요. (브라우저에서는 쓰기 불가)
- 결제/주문 기능은 아직 없고, "주문하기" 버튼은 준비 중 안내만 보여줘요.

## 참고

- 게임 접근 제한은 **화면 가드(ProtectedRoute)** 입니다. `public/games/*.html` 파일 자체는 주소를 알면 직접 열 수 있어요. 진짜 보호가 필요한 데이터(점수 저장 등)를 추가할 땐 Supabase 테이블에 **RLS 정책**을 걸어 주세요.
- 닉네임은 Supabase `user_metadata.nickname` 에 저장돼요. 별도 테이블이 필요 없어요.
- 사진 출처: [Pixabay](https://pixabay.com) (Pixabay 콘텐츠 라이선스: 상업적 이용 가능, 출처 표기 불필요 — 푸터에 감사 표기를 남겼어요).
