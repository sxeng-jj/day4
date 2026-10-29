import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { won } from '../lib/format.js';
import ProductImage from '../components/ProductImage.jsx';

export default function Shop() {
  const { user, configured } = useAuth();
  const { add, items } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cat, setCat] = useState('전체');
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(0);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error: err }) => {
        setLoading(false);
        if (err) setError(`상품을 불러오지 못했어요. Supabase에서 cart.sql 을 실행했는지 확인해 주세요. (${err.message})`);
        else setProducts(data || []);
      });
  }, []);

  const showToast = (text) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  };

  async function onAdd(p) {
    if (!user) return navigate('/login', { state: { from: '/shop' } });
    setBusyId(p.id);
    const { error: err } = await add(p, 1);
    setBusyId(null);
    showToast(err ? `⚠️ ${err}` : `🛒 "${p.name}" 을(를) 담았어요!`);
  }

  const cats = ['전체', ...new Set(products.map((p) => p.category).filter(Boolean))];
  const shown = cat === '전체' ? products : products.filter((p) => p.category === cat);
  const inCart = (id) => items.find((i) => i.product_id === id)?.quantity || 0;

  return (
    <div className="section narrow">
      <h1 className="title">제주 상점</h1>
      <p className="lead">제주의 맛과 감귤이 굿즈를 장바구니에 담아 보세요.</p>

      {!configured && <p className="msg error">Supabase 환경변수가 없어서 상품을 불러올 수 없어요.</p>}
      {error && <p className="msg error">{error}</p>}

      <div className="chips cat-chips">
        {cats.map((c) => (
          <button key={c} className={c === cat ? 'chip on' : 'chip'} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div className="center-note">상품을 불러오는 중…</div>
      ) : (
        <div className="products">
          {shown.map((p) => (
            <article key={p.id} className="product">
              <ProductImage product={p} />
              <div className="pbody">
                <em>{p.category}</em>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="pfoot">
                  <strong>{won(p.price)}</strong>
                  <button className="btn sm" disabled={busyId === p.id || p.stock < 1} onClick={() => onAdd(p)}>
                    {p.stock < 1 ? '품절' : busyId === p.id ? '담는 중…' : '🛒 담기'}
                  </button>
                </div>
                {inCart(p.id) > 0 && <span className="in-cart">장바구니에 {inCart(p.id)}개 담김</span>}
              </div>
            </article>
          ))}
          {!shown.length && !error && <p className="muted">상품이 아직 없어요.</p>}
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          {toast} {toast.startsWith('🛒') && <Link to="/cart">장바구니 보기</Link>}
        </div>
      )}
    </div>
  );
}
