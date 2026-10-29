// Vercel 서버리스 함수: 공공데이터포털(odcloud) 호출을 대신해 주고, 인증키를 브라우저에 노출하지 않는다.
// 필요한 환경변수: DATA_GO_KR_SERVICE_KEY  (※ VITE_ 를 붙이지 말 것 — 붙이면 브라우저에 공개돼요)
const ENDPOINT = 'https://api.odcloud.kr/api/15125100/v1/uddi:32a1b877-af20-4505-a76a-fd389ebd30ca';

export default async function handler(req, res) {
  const raw = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!raw) {
    return res.status(500).json({ error: '서버에 DATA_GO_KR_SERVICE_KEY 환경변수가 없어요.' });
  }
  // 포털의 "Encoding 키"(% 포함)를 넣었어도 동작하도록 한 번 풀어서 사용한다.
  const key = raw.includes('%') ? decodeURIComponent(raw) : raw;

  const url = new URL(ENDPOINT);
  url.searchParams.set('page', '1');
  url.searchParams.set('perPage', '1000');
  url.searchParams.set('returnType', 'JSON');
  url.searchParams.set('serviceKey', key);

  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    const text = await r.text();
    if (!r.ok) {
      // 401: 키 오류 / 승인 대기 등. 키 값은 응답에 포함하지 않는다.
      return res.status(r.status).json({ error: `공공데이터 API 오류 (${r.status})`, detail: text.slice(0, 300) });
    }
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'API 응답을 해석하지 못했어요.', detail: text.slice(0, 200) });
    }
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ totalCount: json.totalCount, rows: json.data || [] });
  } catch (e) {
    return res.status(502).json({ error: '공공데이터 API에 연결하지 못했어요.', detail: String(e).slice(0, 200) });
  }
}
