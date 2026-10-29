import { useAuth } from '../context/AuthContext.jsx';

// 환경변수가 없을 때 로그인/회원가입 화면에 보여주는 안내
export default function SetupNotice() {
  const { configured } = useAuth();
  if (configured) return null;
  return (
    <div className="notice">
      <strong>Supabase 환경변수가 아직 없어요.</strong>
      <ol>
        <li>Supabase 대시보드 → <b>Project Settings → API</b> 에서 <code>Project URL</code>과 <code>anon public</code> 키를 복사해요.</li>
        <li>로컬: <code>jeju-app/.env.local</code> 파일에 <code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>를 넣고 <code>npm run dev</code>를 다시 실행해요.</li>
        <li>Vercel: <b>Project → Settings → Environment Variables</b>에 같은 두 개를 등록하고 <b>Redeploy</b> 해요.</li>
      </ol>
    </div>
  );
}
