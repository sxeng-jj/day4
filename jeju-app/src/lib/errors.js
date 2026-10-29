// Supabase Auth 오류 메시지를 한국어로 바꿔준다.
export function authMessage(error) {
  const m = (error?.message || '').toLowerCase();
  if (!m) return '알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요.';
  if (m.includes('invalid login credentials')) return '이메일 또는 비밀번호가 맞지 않아요.';
  if (m.includes('email not confirmed')) return '이메일 인증이 아직 안 됐어요. 받은 메일함의 인증 링크를 눌러 주세요.';
  if (m.includes('user already registered')) return '이미 가입된 이메일이에요. 로그인해 주세요.';
  if (m.includes('password should be at least')) return '비밀번호는 6자 이상이어야 해요.';
  if (m.includes('unable to validate email') || m.includes('invalid email')) return '이메일 형식이 올바르지 않아요.';
  if (m.includes('rate limit') || m.includes('too many')) return '요청이 너무 많아요. 잠시 뒤에 다시 시도해 주세요.';
  if (m.includes('same password') || m.includes('different from the old')) return '이전과 다른 비밀번호를 입력해 주세요.';
  if (m.includes('failed to fetch') || m.includes('network')) return '네트워크 연결을 확인해 주세요.';
  return `오류: ${error.message}`;
}
