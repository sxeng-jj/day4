import { categoryEmoji } from '../lib/format.js';

// 상품 이미지가 없으면 분류 이모지로 대신 보여준다.
export default function ProductImage({ product, className = '' }) {
  if (product.image_url) {
    return <img className={`pimg ${className}`} src={product.image_url} alt={product.name} loading="lazy" />;
  }
  return <div className={`pimg pimg-empty ${className}`} aria-label={product.name}>{categoryEmoji(product.category)}</div>;
}
