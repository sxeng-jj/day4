import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { won, FREE_SHIPPING_FROM, SHIPPING_FEE } from '../lib/format.js';
import ProductImage from '../components/ProductImage.jsx';

export default function Cart() {
  const { items, loading, error, count, total, setQty, remove, clear } = useCart();
  const [notice, setNotice] = useState('');

  const shipping = total === 0 || total >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  const remain = FREE_SHIPPING_FROM - total;

  function onOrder() {
    setNotice('결제 기능은 아직 준비 중이에요. 곧 만나요! 🍊');
    setTimeout(() => setNotice(''), 3000);
  }

  return (
    <div className="section narrow">
      <h1 className="title">장바구니</h1>
      {error && <p className="msg error">{error}</p>}

      {loading && !items.length ? (
        <div className="center-note">불러오는 중…</div>
      ) : !items.length ? (
        <div className="empty-cart">
          <span>🛒</span>
          <h2>장바구니가 비어 있어요</h2>
          <p className="muted">마음에 드는 제주 상품을 담아 보세요.</p>
          <Link to="/shop" className="btn lg">상점 구경하기</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-list">
            {items.map((it) => (
              <li key={it.id} className="cart-row">
                <ProductImage product={it.products} className="cart-thumb" />
                <div className="cart-info">
                  <h3>{it.products.name}</h3>
                  <p className="muted">{won(it.products.price)}</p>
                </div>
                <div className="qty" aria-label="수량">
                  <button onClick={() => setQty(it, it.quantity - 1)} aria-label="하나 빼기">−</button>
                  <span>{it.quantity}</span>
                  <button onClick={() => setQty(it, it.quantity + 1)} aria-label="하나 더하기">+</button>
                </div>
                <strong className="line-total">{won(it.products.price * it.quantity)}</strong>
                <button className="x" onClick={() => remove(it)} aria-label={`${it.products.name} 삭제`}>🗑</button>
              </li>
            ))}
          </ul>

          <aside className="summary">
            <h2>주문 요약</h2>
            <dl>
              <div><dt>상품 {count}개</dt><dd>{won(total)}</dd></div>
              <div><dt>배송비</dt><dd>{shipping === 0 ? '무료' : won(shipping)}</dd></div>
              <div className="sum"><dt>합계</dt><dd>{won(total + shipping)}</dd></div>
            </dl>
            {remain > 0 && <p className="free-hint">{won(remain)} 더 담으면 배송비 무료!</p>}
            <button className="btn lg full" onClick={onOrder}>주문하기</button>
            <button className="btn ghost full" onClick={clear}>장바구니 비우기</button>
            <Link to="/shop" className="more-link">+ 쇼핑 계속하기</Link>
            {notice && <p className="msg ok">{notice}</p>}
          </aside>
        </div>
      )}
    </div>
  );
}
