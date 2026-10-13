
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ProductDetail.css';

const API_URL = 'http://127.0.0.1:8000/api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_URL}/products/${id}/`);

        if (!response.ok) {
          throw new Error('Product not found.');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Unable to load this product.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));

  if (loading) {
    return <main className="detail-message">Loading product...</main>;
  }

  if (error || !product) {
    return (
      <main className="detail-message">
        <h2>{error || 'Product not found.'}</h2>
        <Link to="/">Return to homepage</Link>
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      <Link to="/" className="detail-back-link">
        ← Back to NovaTech
      </Link>

      <div className="product-detail-layout">
        <div className="detail-image-panel">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-information">
          <span className="detail-eyebrow">
            {product.category?.name || 'Technology'}
          </span>

          <h1>{product.name}</h1>

          <p className="detail-price">{formatPrice(product.price)}</p>

          <p className="detail-description">{product.description}</p>

          <p className="detail-availability">
            <span className="detail-status-dot" />
            Available
          </p>

          <button
            className="detail-buy-button"
            type="button"
            onClick={() => alert('Shopping cart functionality is coming soon.')}
          >
            Add to bag
          </button>

          <p className="detail-note">
            Thoughtfully designed technology, made for your everyday.
          </p>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
