// 이미지는 Pixabay(무료 라이선스)에서 받아 public/images 에 넣어 둔 파일이다.
export const PHOTOS = [
  { src: '/images/jeju-hero.jpg', title: '현무암 돌탑과 푸른 바다' },
  { src: '/images/jeju-jusangjeolli.jpg', title: '주상절리 절벽' },
  { src: '/images/jeju-tangerine.jpg', title: '햇살 가득 제주 감귤' },
  { src: '/images/jeju-sea.jpg', title: '붉은 등대와 갈매기' },
  { src: '/images/jeju-waterfall.jpg', title: '천지연 폭포' },
  { src: '/images/jeju-coast.jpg', title: '제주 해안' },
  { src: '/images/jeju-island.jpg', title: '섬 풍경' },
  { src: '/images/jeju-lighthouse.jpg', title: '바다를 지키는 등대' },
  { src: '/images/jeju-tea.jpg', title: '초록빛 녹차밭' },
];

export const CHARACTERS = [
  { id: 'gyuli', name: '감귤이', role: '주인공 · 호기심 대장', emoji: null, color: '#ff8a1f',
    desc: '제주 감귤나무에서 태어난 둥글둥글 귤 친구예요. 폴짝폴짝 뛰어다니는 걸 제일 좋아하고, 궁금한 건 못 참아요.',
    skills: ['폴짝 점프', '더블 점프', '감귤 대시'] },
  { id: 'hareubang', name: '돌하르방', role: '제주의 수호자', emoji: '🗿', color: '#7c7a78',
    desc: '검은 현무암으로 만들어진 돌 할아버지예요. 무뚝뚝해 보여도 마음은 누구보다 따뜻해서 마을을 든든하게 지켜줘요.',
    skills: ['든든한 방패', '묵직한 박치기', '느긋한 낮잠'] },
  { id: 'sumbi', name: '숨비', role: '바다 안내자', emoji: '🤿', color: '#2f9bd6',
    desc: '바닷속 구석구석을 훤히 아는 용감한 해녀예요. "휘이~" 숨비소리로 친구들에게 파도의 소식을 전해줘요.',
    skills: ['깊은 잠수', '숨비소리', '테왁 부스터'] },
  { id: 'bongbong', name: '봉봉이', role: '달콤한 단짝', emoji: '🍈', color: '#f2b705',
    desc: '머리에 귀여운 혹이 달린 한라봉 친구예요. 달콤한 향기로 주변을 환하게 만들고, 위험할 땐 방어막이 되어줘요.',
    skills: ['달콤 방어막', '향기 자석', '봉봉 점프'] },
  { id: 'oreum', name: '오름이', role: '꼬마 화산', emoji: '⛰️', color: '#4f9a3a',
    desc: '한라산 아래 오름에서 사는 작은 화산 꼬마예요. 화가 나면 폭신한 연기를 뿜지만, 금방 풀어져요.',
    skills: ['폭신 연기', '언덕 굴리기', '일출 구경'] },
  { id: 'galgal', name: '갈갈이', role: '바람 배달부', emoji: '🕊️', color: '#8a9bb0',
    desc: '제주 하늘을 누비는 갈매기 우체부예요. 바람을 타고 섬 곳곳의 소식을 가장 먼저 알려줘요.',
    skills: ['바람 타기', '빠른 배달', '높이 날기'] },
];

export const GAMES = [
  { id: 'jeju', file: '/games/index.html', title: '제주 미니어처 섬', emoji: '🏝️', tag: '3D 감상',
    desc: '한라산·성산일출봉·유채꽃밭이 있는 작은 제주도를 돌려 보며 구경해요.', img: '/images/jeju-island.jpg' },
  { id: 'hop', file: '/games/game.html', title: '감귤이의 폴짝 대모험', emoji: '🍊', tag: '액션',
    desc: '폴짝폴짝 뛰며 장애물을 피하고 감귤을 모아요. 대시와 콤보로 신기록에 도전!', img: '/images/jeju-tangerine.jpg' },
  { id: 'race', file: '/games/race.html', title: '제주 그랑프리', emoji: '🏎️', tag: '레이싱 · 2인',
    desc: '한라산이 보이는 서킷에서 1인 또는 2인 화면 분할로 달려요.', img: '/images/jeju-coast.jpg' },
  { id: 'space', file: '/games/space.html', title: '감귤이 우주 탐험', emoji: '🚀', tag: '3D 감상',
    desc: '우주선이 지나가는 태양계를 구경해요. C 키로 우주선 시점!', img: null, bg: 'linear-gradient(135deg,#1c2455,#5b3fa0)' },
  { id: 'ai', file: '/games/transformer.html', title: 'AI 말하기 교실', emoji: '🤖', tag: '배우기',
    desc: '챗GPT 같은 AI가 말하는 원리를 감귤이와 함께 쉽게 배워요.', img: null, bg: 'linear-gradient(135deg,#7a4be0,#4aa8ff)' },
];
