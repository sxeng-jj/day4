import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);
const MAX_QTY = 99;

// 장바구니(cart_items) 상태를 Supabase 와 동기화한다.
// 보안은 DB 의 RLS 정책(본인 행만 접근)이 담당하고, 여기서는 화면 상태만 관리한다.
export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!supabase || !userId) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from('cart_items')
      .select('id, quantity, product_id, products ( id, name, price, image_url, category, stock )')
      .order('created_at', { ascending: true });
    setLoading(false);
    if (err) {
      setError(`장바구니를 불러오지 못했어요. (${err.message})`);
      return;
    }
    setError('');
    setItems((data || []).filter((row) => row.products)); // 상품이 삭제된 줄은 숨긴다
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 상품 담기: 이미 있으면 수량을 늘린다.
  const add = useCallback(
    async (product, qty = 1) => {
      if (!supabase || !userId) return { error: '로그인이 필요해요.' };
      const cur = items.find((i) => i.product_id === product.id);
      const limit = Math.min(MAX_QTY, product.stock ?? MAX_QTY);
      const next = Math.min(limit, (cur?.quantity || 0) + qty);
      if (cur && next === cur.quantity) return { error: `이 상품은 최대 ${limit}개까지 담을 수 있어요.` };
      const { error: err } = await supabase
        .from('cart_items')
        .upsert({ user_id: userId, product_id: product.id, quantity: next }, { onConflict: 'user_id,product_id' });
      if (err) return { error: err.message };
      await refresh();
      return {};
    },
    [items, userId, refresh],
  );

  // 수량 변경 (화면은 먼저 바꾸고, 실패하면 다시 불러온다)
  const setQty = useCallback(
    async (item, qty) => {
      if (qty < 1) return remove(item);
      const limit = Math.min(MAX_QTY, item.products.stock ?? MAX_QTY);
      const next = Math.min(limit, qty);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity: next } : i)));
      const { error: err } = await supabase.from('cart_items').update({ quantity: next }).eq('id', item.id);
      if (err) {
        setError(`수량을 바꾸지 못했어요. (${err.message})`);
        await refresh();
      }
      return {};
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refresh],
  );

  const remove = useCallback(
    async (item) => {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      const { error: err } = await supabase.from('cart_items').delete().eq('id', item.id);
      if (err) {
        setError(`삭제하지 못했어요. (${err.message})`);
        await refresh();
      }
      return {};
    },
    [refresh],
  );

  const clear = useCallback(async () => {
    if (!userId) return;
    setItems([]);
    const { error: err } = await supabase.from('cart_items').delete().eq('user_id', userId);
    if (err) {
      setError(`장바구니를 비우지 못했어요. (${err.message})`);
      await refresh();
    }
  }, [userId, refresh]);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.quantity * i.products.price, 0);
    return { items, loading, error, count, total, add, setQty, remove, clear, refresh };
  }, [items, loading, error, add, setQty, remove, clear, refresh]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart 는 CartProvider 안에서만 사용할 수 있어요.');
  return ctx;
}
