
import Auth from "./Auth";
import Profile from "./Profile";
import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDetail from './ProductDetail';

const API_URL = 'http://127.0.0.1:8000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHomepage() {
      try {
        const [productResponse, bannerResponse] = await Promise.all([
          fetch(`${API_URL}/products/`),
          fetch(`${API_URL}/banners/`),
        ]);

        if (!productResponse.ok || !bannerResponse.ok) {
          throw new Error('Could not load website data.');
        }

        const productData = await productResponse.json();
        const bannerData = await bannerResponse.json();

        setProducts(productData);
        setBanners(bannerData);
      } catch (err) {
        setError('Unable to load products. Please check that Django is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, []);

  const banner = banners[0];
  const featuredProduct =
    products.find((product) => product.is_featured) || products[0];

  const categories = [
    ...new Map(
      products
        .filter((product) => product.category)
        .map((product) => [
          product.category.id,
          product.category,
        ])
    ).values(),
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));

  return (
    <div className="app">
      <div className="announcement">
        Thoughtfully designed technology. Made for your everyday.
      </div>

      <header className="navbar">
        <a className="brand" href="#home">
          nova<span>tech.</span>
        </a>

        <nav className="nav-links">
          <a href="#products">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#story">Our story</a>
        </nav>

        <div className="nav-actions">
          <a href="#products" aria-label="Search products">⌕</a>
          <a href="#account" aria-label="My account">♙</a>
          <a href="#products" aria-label="Shopping bag">Bag</a>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <span className="eyebrow">THE NEXT GENERATION</span>

            <h1>
              {banner ? (
                banner.title
              ) : (
                <>
                  A little more
                  <br />
                  <span>extraordinary.</span>
                </>
              )}
            </h1>

            <p>
              {banner?.subtitle ||
                'Discover technology that brings beautiful design and everyday performance together.'}
            </p>

            <a
              className="primary-button"
              href={banner?.button_link || '#products'}
            >
              {banner?.button_text || 'Explore the collection'} <span>↗</span>
            </a>

            <div className="hero-note">
              <span className="status-dot" />
              Discover our latest arrivals
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            {(banner?.image || featuredProduct?.image) && (
              <img
                src={banner?.image || featuredProduct?.image}
                alt={banner?.title || featuredProduct?.name || 'Featured product'}
                className="hero-phone"
              />
            )}

            <div className="floating-label">
              <span>01 / NOVA SERIES</span>
              <strong>Designed to inspire.</strong>
            </div>
          </div>
        </section>

        <section className="categories section" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FIND YOUR NEXT FAVOURITE</span>
              <h2>Explore by category</h2>
            </div>
            <a href="#products" className="text-link">
              View everything ↗
            </a>
          </div>

          <div className="category-grid">
            {categories.map((category, index) => (
              <a
                href="#products"
                className="category-card"
                key={category.id}
              >
                <span className="category-icon">
                  {['▯', '▱', '◉', '◷'][index % 4]}
                </span>
                <span>{category.name}</span>
                <span className="category-arrow">↗</span>
              </a>
            ))}

            {!loading && categories.length === 0 && (
              <p>No product categories available yet.</p>
            )}
          </div>
        </section>

        <section className="products-section section" id="products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CURATED FOR YOU</span>
              <h2>Meet your next favourite.</h2>
            </div>
            <a href="#products" className="text-link">
              Shop all products ↗
            </a>
          </div>

          {loading && <p>Loading products...</p>}

          {error && <p role="alert">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p>No products available at the moment.</p>
          )}

          <div className="product-grid">
            {products.map((product) => (
<article
  className="product-card"
  key={product.id}
  onClick={() => {
    window.location.href = `/products/${product.id}`;
  }}
  style={{ cursor: 'pointer' }}
>                <div className="product-image-wrap">
                  {product.is_featured && (
                    <span className="product-tag">FEATURED</span>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />

                  <button
                    className="quick-add"
                    type="button"
                    onClick={() =>
                      alert(`${product.name} selected! Shopping cart coming soon.`)
                    }
                    aria-label={`Select ${product.name}`}
                  >
                    +
                  </button>
                </div>

                <div className="product-info">
                  <span className="product-category">
                    {product.category?.name || 'Technology'}
                  </span>
                  <h3>{product.name}</h3>
                  <strong>{formatPrice(product.price)}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="story-banner" id="story">
          <div>
            <span className="eyebrow">TECHNOLOGY, THOUGHTFULLY MADE</span>
            <h2>Less noise.<br />More possibility.</h2>
            <p>
              The little details make all the difference.
              Find technology that feels right for you.
            </p>
            <a className="light-button" href="#products">
              Find your device ↗
            </a>
          </div>
          <div className="story-decoration">n.</div>
        </section>
      </main>

      <footer className="footer" id="account">
        <a className="brand" href="#home">
          nova<span>tech.</span>
        </a>
        <p>Good technology. Better everyday.</p>
        <span>© 2026 NovaTech. Created for the Medowa assessment.</span>
      </footer>
    </div>
  );
}


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/auth" element={<Auth />} />
<Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

