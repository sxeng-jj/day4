import { Link } from 'react-router-dom';
import Gyuli from '../components/Gyuli.jsx';

export default function NotFound() {
  return (
    <div className="center-note">
      <Gyuli size={110} />
      <h1>길을 잃었어요!</h1>
      <p>찾는 페이지가 없어요.</p>
      <Link to="/" className="btn lg">홈으로 가기</Link>
    </div>
  );
}
