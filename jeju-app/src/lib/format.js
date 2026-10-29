export const won = (n) => `${Number(n || 0).toLocaleString('ko-KR')}원`;

const EMOJI = { 과일: '🍊', 굿즈: '🧸', 차: '🍵', 간식: '🍫', 문구: '💌' };
export const categoryEmoji = (c) => EMOJI[c] || '🎁';

export const FREE_SHIPPING_FROM = 30000;
export const SHIPPING_FEE = 3000;
