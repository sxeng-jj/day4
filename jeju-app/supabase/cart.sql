-- =====================================================================
-- 제주 감귤이 월드 · 장바구니 테이블
-- Supabase 대시보드 → SQL Editor → New query 에 전체를 붙여넣고 Ctrl+Enter (Run)
-- 여러 번 실행해도 안전하도록 작성했어요 (if not exists / drop ... if exists).
-- =====================================================================

-- 1) 상품 테이블 -------------------------------------------------------
create table if not exists public.products (
  id          bigint generated always as identity primary key,
  name        text        not null,
  description text,
  price       integer     not null check (price >= 0),          -- 원 단위
  image_url   text,                                              -- /images/... 또는 외부 URL
  category    text,
  stock       integer     not null default 100 check (stock >= 0),
  created_at  timestamptz not null default now()
);

-- 2) 장바구니 테이블 (회원별) --------------------------------------------
create table if not exists public.cart_items (
  id          bigint generated always as identity primary key,
  user_id     uuid        not null default auth.uid()
                          references auth.users (id) on delete cascade,
  product_id  bigint      not null references public.products (id) on delete cascade,
  quantity    integer     not null default 1 check (quantity between 1 and 99),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, product_id)                                   -- 같은 상품은 한 줄, 수량만 증가
);

create index if not exists cart_items_user_idx on public.cart_items (user_id);

-- 3) 수정 시 updated_at 자동 갱신 ---------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();

-- 4) 행 수준 보안(RLS) ---------------------------------------------------
alter table public.products   enable row level security;
alter table public.cart_items enable row level security;

-- 상품: 누구나 읽기만 가능 (쓰기 정책이 없으므로 브라우저에서는 수정 불가)
drop policy if exists "products_select_all" on public.products;
create policy "products_select_all"
  on public.products for select
  using (true);

-- 장바구니: 로그인한 본인 행만 조회/추가/수정/삭제
drop policy if exists "cart_select_own" on public.cart_items;
create policy "cart_select_own"
  on public.cart_items for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "cart_insert_own" on public.cart_items;
create policy "cart_insert_own"
  on public.cart_items for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "cart_update_own" on public.cart_items;
create policy "cart_update_own"
  on public.cart_items for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "cart_delete_own" on public.cart_items;
create policy "cart_delete_own"
  on public.cart_items for delete to authenticated
  using (auth.uid() = user_id);

-- 5) 샘플 상품 (products 가 비어 있을 때만 넣음) ---------------------------
insert into public.products (name, description, price, image_url, category)
select v.name, v.description, v.price, v.image_url, v.category
from (values
  ('제주 감귤 3kg',        '햇살 가득 받고 자란 달콤새콤 제주 노지 감귤',          15000, '/images/jeju-tangerine.jpg',    '과일'),
  ('한라봉 선물세트 2kg',  '머리에 혹이 달린 향긋한 한라봉, 정성껏 포장했어요',    28000, '/images/jeju-tangerine.jpg',    '과일'),
  ('감귤이 인형 (대형)',   '폴짝폴짝 뛰던 감귤이를 꼭 안아 보세요',                 19800, null,                            '굿즈'),
  ('돌하르방 미니 피규어', '책상 위를 지켜주는 든든한 돌하르방',                   12000, '/images/jeju-hero.jpg',         '굿즈'),
  ('제주 녹차 티백 20입',  '초록빛 녹차밭의 향을 담은 티백',                         9800, '/images/jeju-tea.jpg',          '차'),
  ('현무암 돌탑 무드등',   '검은 현무암 돌탑 모양의 은은한 조명',                   24000, '/images/jeju-hero.jpg',         '굿즈'),
  ('감귤 초콜릿 10개입',   '새콤한 감귤 필링이 들어간 초콜릿',                       8500, null,                            '간식'),
  ('천지연 폭포 엽서 세트','제주 풍경 엽서 6장 세트',                                5000, '/images/jeju-waterfall.jpg',    '문구')
) as v(name, description, price, image_url, category)
where not exists (select 1 from public.products);
