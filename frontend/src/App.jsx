import { useEffect, useState } from "react";

import {

  Link,

  BrowserRouter,

  Routes,

  Route,

  useNavigate,

  useParams,

} from "react-router-dom";

import Bag from "./Bag";

import Auth from "./Auth";

import Profile from "./Profile";

import ProductDetail from "./ProductDetail";

import "./App.css";



const API_BASE_URL = (

  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api`;



const DEVICE_CATEGORIES = [

  { name: "Smartphones", slug: "smartphones", keywords: ["smartphone", "smartphones", "mobile", "mobiles", "phone", "phones"] },

  { name: "Smartwatches", slug: "smartwatches", keywords: ["smartwatch", "smartwatches", "watch", "watches"] },

  { name: "TVs & Displays", slug: "tvs", keywords: ["tv", "tvs", "television", "televisions", "display", "displays", "monitor", "monitors"] },

  { name: "Audio & Accessories", slug: "accessories", keywords: ["audio", "accessories", "accessory", "headphones", "earbuds", "speaker", "speakers", "earphones"] },

];



function formatPrice(price) {

  return new Intl.NumberFormat("en-IN", {

    style: "currency",

    currency: "INR",

    maximumFractionDigits: 0,

  }).format(Number(price || 0));

}



function getProductImage(product) {
  // Product-specific images bundled in frontend/public/images/.
  // Local images take priority so unrelated Django media uploads cannot
  // make every product card display the same phone.
  const name = (product?.name || "").toLowerCase().trim();

  const localImages = [
    // Smartphones
    { match: ["nova lite"], src: "/images/nova_lite_1.png" },
    { match: ["nova pro 2", "nova pro2", "nova_pro2_front"], src: "/images/nova_pro2_front.png" },
    { match: ["nova pro black"], src: "/images/novapro_black_1.png" },
    { match: ["nova pro silver", "nova pro"], src: "/images/novapro.jpg" },

    // Smartwatches
    { match: ["nova watch ultra", "nova ultra"], src: "/images/nova_ultra_front.jpg" },
    { match: ["nova watch pro", "nova watchpro"], src: "/images/nova_watchpro_front.jpg" },
    { match: ["nova watch"], src: "/images/nova_watch_front.jpg" },

    // TVs and displays
    { match: ["nova tv 55", "nova tv55"], src: "/images/nova_tv55_front.jpg" },
    { match: ["nova tv 65", "nova tv65"], src: "/images/nova_tv65_front.jpg" },
    { match: ["nova monitor"], src: "/images/nova_monitor_front.jpg" },

    // Audio
    { match: ["nova headphones", "headphones pro"], src: "/images/nova_headphones_front.jpg" },
    { match: ["nova buds", "earbuds"], src: "/images/nova_buds_front.jpg" },
    { match: ["nova sound", "speaker"], src: "/images/nova_sound_front.jpg" },
  ];

  const local = localImages.find((item) =>
    item.match.some((part) => name.includes(part))
  );
  if (local) return local.src;

  // Django ImageField URLs may be relative (/media/...) or absolute.
  if (product?.image) {
    if (/^https?:\/\//i.test(product.image)) return product.image;
    if (product.image.startsWith("/")) return `${API_BASE_URL}${product.image}`;
    return `${API_BASE_URL}/media/${product.image.replace(/^\/+/, "")}`;
  }

  // Safe fallback for products without a dedicated image.
  return "/images/novapro.jpg";
}


function getCategorySlug(product) {

  const categoryName = product.category?.name?.toLowerCase().trim() || "";

  const productName = product.name?.toLowerCase() || "";

  for (const category of DEVICE_CATEGORIES) {

    if (category.keywords.some((word) => categoryName.includes(word))) return category.slug;

  }

  for (const category of DEVICE_CATEGORIES) {

    if (category.keywords.some((word) => productName.includes(word))) return category.slug;

  }

  return "other";

}



function ScrollToTop() {

  const { pathname, hash } = window.location;

  useEffect(() => {

    if (hash) {

      const timer = window.setTimeout(() => {

        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });

      }, 80);

      return () => window.clearTimeout(timer);

    }

    window.scrollTo({ top: 0, behavior: "smooth" });

  }, [pathname, hash]);

  return null;

}



function Header() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mobileDevicesOpen, setMobileDevicesOpen] = useState(false);



  function closeMenu() {

    setMobileMenuOpen(false);

    setMobileDevicesOpen(false);

  }



  return (

    <>

      <div className="announcement">

        <span className="announcement-dot" />

        Thoughtfully designed technology. Made for your everyday.

        <Link to="/shop">Discover more <span aria-hidden="true">↗</span></Link>

      </div>

      <header className="navbar">

        <Link className="brand" to="/" onClick={closeMenu} aria-label="NovaTech home">

          nova<span>tech.</span>

        </Link>



        <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label="Main navigation">

          <div className="nav-menu">

            <Link to="/shop" onClick={closeMenu}>Shop</Link>

            <div className="nav-dropdown mega-dropdown">

              <div className="dropdown-column">

                <span className="dropdown-label">EXPLORE NOVATECH</span>

                <Link to="/shop" className="dropdown-feature" onClick={closeMenu}>Shop all products <span>↗</span></Link>

                <Link to="/#products" onClick={closeMenu}>Featured products</Link>

                <Link to="/#categories" onClick={closeMenu}>Explore categories</Link>

                <Link to="/#story" onClick={closeMenu}>Our philosophy</Link>

              </div>

              <div className="dropdown-highlight">

                <span className="dropdown-label">THE NOVA SERIES</span>

                <img src="/images/novapro.jpg" alt="Nova Pro smartphone" />

                <strong>Meet Nova Pro.</strong>

                <Link to="/category/smartphones" onClick={closeMenu}>Discover the collection ↗</Link>

              </div>

            </div>

          </div>



          <div className={`nav-menu ${mobileDevicesOpen ? "mobile-submenu-open" : ""}`}>

            <button className="nav-menu-button" type="button" onClick={() => setMobileDevicesOpen((open) => !open)}>

              Devices <span className="nav-chevron">⌄</span>

            </button>

            <div className="nav-dropdown device-dropdown">

              <span className="dropdown-label">FIND YOUR DEVICE</span>

              {DEVICE_CATEGORIES.map((category) => (

                <Link key={category.slug} to={`/category/${category.slug}`} onClick={closeMenu}>

                  <span aria-hidden="true">↗</span>{category.name}

                </Link>

              ))}

            </div>

          </div>



          <div className="nav-menu">

            <Link to="/#story" onClick={closeMenu}>Discover</Link>

            <div className="nav-dropdown discover-dropdown">

              <span className="dropdown-label">THE NOVATECH EXPERIENCE</span>

              <Link to="/#story" onClick={closeMenu}>Our story</Link>

              <Link to="/shop" onClick={closeMenu}>Customer favourites</Link>

              <Link to="/#categories" onClick={closeMenu}>Find your next device</Link>

            </div>

          </div>

        </nav>



        <div className="nav-actions">

          <Link to="/shop" aria-label="Browse products" title="Browse products" className="nav-icon">

            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>

          </Link>

          <Link to="/auth" aria-label="My account" title="My account" className="nav-icon">

            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.5 3.2-5.3 7-5.3s6.3 1.8 7 5.3" /></svg>

          </Link>

          <Link to="/bag" aria-label="Shopping bag" title="Shopping bag" className="nav-icon bag-icon" onClick={closeMenu}>

            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>

          </Link>

          <button className={`mobile-menu-toggle ${mobileMenuOpen ? "is-open" : ""}`} onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} type="button">

            <span /><span />

          </button>

        </div>

      </header>

    </>

  );

}



function Footer() {

  return (

    <footer className="footer">

      <div className="footer-main">

        <div className="footer-brand">

          <Link className="brand" to="/">nova<span>tech.</span></Link>

          <p>Good technology. Better everyday.</p>

        </div>

        <div className="footer-column">

          <strong>Explore</strong>

          <Link to="/shop">All products</Link>

          <Link to="/category/smartphones">Smartphones</Link>

          <Link to="/category/smartwatches">Smartwatches</Link>

          <Link to="/category/tvs">TVs &amp; Displays</Link>

          <Link to="/category/accessories">Audio &amp; Accessories</Link>

        </div>

        <div className="footer-column">

          <strong>Help &amp; account</strong>

          <Link to="/auth">Sign in / Register</Link>

          <Link to="/profile">My account</Link>

          <Link to="/">Back to home ↑</Link>

        </div>

      </div>

      <div className="footer-bottom">

        <span>© 2026 NovaTech. All rights reserved.</span>

        <span>Thoughtfully designed for everyday life.</span>

      </div>

    </footer>

  );

}



function ProductGrid({ products, loading, error }) {

  if (loading) return <p className="loading-message">Finding your favourites…</p>;

  if (error) return <p className="error-message" role="alert">{error}</p>;

  if (!products.length) {

    return <p className="empty-message">No products in this collection yet. Add products in Django admin and assign them to the correct category.</p>;

  }



  return (

    <div className="product-grid">

      {products.map((product, index) => (

        <Link className="product-card" key={product.id} to={`/products/${product.id}`} style={{ "--card-index": index }}>

          <div className="product-image-wrap">

            {product.is_featured && <span className="product-tag">FEATURED</span>}

            <img

              src={getProductImage(product)}

              alt={product.name}

              loading="lazy"

              onError={(event) => {

                if (!event.currentTarget.src.endsWith("/images/novapro.jpg")) event.currentTarget.src = "/images/novapro.jpg";

              }}

            />

            <span className="product-view-label">Discover product ↗</span>

          </div>

          <div className="product-info">

            <span className="product-category">{product.category?.name || "Technology"}</span>

            <h3>{product.name}</h3>

            <strong>{formatPrice(product.price)}</strong>

          </div>

        </Link>

      ))}

    </div>

  );

}



function useStoreData() {

  const [products, setProducts] = useState([]);

  const [banners, setBanners] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  useEffect(() => {

    let cancelled = false;



    async function loadData() {

      try {

        setLoading(true);

        setError("");

        const [productResponse, bannerResponse] = await Promise.all([

          fetch(`${API_URL}/products/`),

          fetch(`${API_URL}/banners/`),

        ]);

        if (!productResponse.ok) throw new Error("Could not load products from the server.");

        const productData = await productResponse.json();

        const bannerData = bannerResponse.ok ? await bannerResponse.json() : [];

        if (!Array.isArray(productData)) throw new Error("Unexpected products API response.");



        if (!cancelled) {

          setProducts(productData.filter((product) => product.is_active !== false));

          setBanners(Array.isArray(bannerData) ? bannerData : []);

        }

      } catch (err) {

        console.error("Store API error:", err);

        if (!cancelled) setError("Unable to load products. Please check your connection and try again.");

      } finally {

        if (!cancelled) setLoading(false);

      }

    }



    loadData();

    return () => { cancelled = true; };

  }, []);



  return { products, banners, loading, error };

}



function useScrollReveal(dependencies = []) {

  useEffect(() => {

    const elements = document.querySelectorAll("[data-reveal]");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;



    if (reducedMotion || !("IntersectionObserver" in window)) {

      elements.forEach((element) => element.classList.add("is-visible"));

      return;

    }



    const observer = new IntersectionObserver((entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);

        }

      });

    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });



    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();

  // Re-observe when page content changes after API data loads.

  // eslint-disable-next-line react-hooks/exhaustive-deps

  }, dependencies);

}



function HomePage() {

  const { products, banners, loading, error } = useStoreData();

  const banner = banners[0];

  const featuredProduct = products.find((product) => product.is_featured) || products[0];

  const featuredProducts = products.filter((product) => product.is_featured);

  const categories = [...new Map(products.filter((product) => product.category).map((product) => [product.category.id, product.category])).values()];



  useScrollReveal([loading, products.length]);



  const heroImage = banner?.image || (featuredProduct ? getProductImage(featuredProduct) : "/images/phn1.jpg");



  return (

    <div className="app">

      <Header />

      <main>

        <section className="hero hero-video-landing" id="home">
          <div className="hero-video-copy">
            <span className="eyebrow hero-eyebrow">
              <span className="eyebrow-line" /> INTRODUCING THE NOVA SERIES
            </span>

            <h1 key={banner?.title || "default-hero"}>
              {banner?.title || (
                <>
                  Experience the
                  <br />
                  Future with
                  <br />
                  <span>NovaTech.</span>
                </>
              )}
            </h1>

            <p>
              {banner?.subtitle ||
                "Thoughtfully designed technology. Made for your everyday."}
            </p>

            <div className="hero-buttons">
              <Link className="primary-button" to={banner?.button_link || "/shop"}>
                {banner?.button_text || "Shop now"} <span>↗</span>
              </Link>
              <Link className="secondary-button" to="/category/smartphones">
                Meet Nova Pro <span>→</span>
              </Link>
            </div>
          </div>

          <div className="hero-video-frame">
            <video
              className="hero-product-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="NovaTech product showcase video"
              poster="/images/phn1.jpg"
            >
              <source src="/videos/novatech-hero.mp4" type="video/mp4" />
            </video>
            <div className="hero-video-caption">
              <span>THE NOVA COLLECTION</span>
              <strong>Designed to inspire.</strong>
            </div>
          </div>

          <div className="hero-video-footer">
            <span>THOUGHTFULLY DESIGNED TECHNOLOGY</span>
            <a href="#categories">Scroll to explore ↓</a>
            <span>01 — NOVATECH</span>
          </div>
        </section>



        <section className="category-section section" id="categories" data-reveal>

          <div className="section-heading">

            <div><span className="eyebrow">FIND YOUR NEXT FAVOURITE</span><h2>Made for your world.</h2></div>

            <Link to="/shop" className="text-link">Explore all products <span>↗</span></Link>

          </div>

          <div className="category-grid">

            {DEVICE_CATEGORIES.map((category, index) => (

              <Link to={`/category/${category.slug}`} className="category-card" key={category.slug}>

                <span className="category-number">0{index + 1}</span>

                <span className="category-icon">{["▯", "◷", "▣", "◉"][index]}</span>

                <span className="category-name">{category.name}</span>

                <span className="category-arrow">↗</span>

              </Link>

            ))}

          </div>

          {categories.length === 0 && !loading && <p className="empty-message">Add categories and products in Django admin to populate your store.</p>}

        </section>



        <section className="dark-showcase" data-reveal>

          <div className="dark-showcase-top">

            <span className="eyebrow">THE NOVA EXPERIENCE</span>

            <span className="showcase-index">N° 01 / BUILT FOR MORE</span>

          </div>

          <div className="dark-showcase-copy">

            <p className="showcase-kicker">MEET YOUR NEXT FAVOURITE</p>

            <h2>Power meets<br /><span>poise.</span></h2>

            <p className="showcase-description">Every detail considered. Every moment elevated. Meet technology made to feel extraordinary.</p>

            <Link className="showcase-link" to="/shop">Explore the collection <span>↗</span></Link>

          </div>

          <div className="dark-product-art">

            <div className="dark-product-halo" />

            <img

              src={featuredProduct ? getProductImage(featuredProduct) : "/images/novapro.jpg"}

              alt={featuredProduct?.name || "NovaTech featured device"}

              loading="lazy"

              onError={(event) => {

                if (!event.currentTarget.src.endsWith("/images/novapro.jpg")) event.currentTarget.src = "/images/novapro.jpg";

              }}

            />

            <div className="dark-product-caption"><span>THE NOVA SERIES</span><strong>{featuredProduct?.name || "Nova Pro"}</strong></div>

          </div>

          <div className="showcase-bottom"><span>DESIGNED WITH INTENTION</span><span>01 / NOVATECH</span></div>

        </section>



        <section className="products-section section" id="products" data-reveal>

          <div className="section-heading">

            <div><span className="eyebrow">A LITTLE SOMETHING SPECIAL</span><h2>Meet your next favourite.</h2><p className="section-description">Thoughtful design. Everyday possibility.</p></div>

            <Link to="/shop" className="text-link">Shop all products <span>↗</span></Link>

          </div>

          <ProductGrid products={featuredProducts.length ? featuredProducts : products} loading={loading} error={error} />

        </section>



        <section className="story-banner" id="story" data-reveal>

          <div className="story-content">

            <span className="eyebrow">TECHNOLOGY, THOUGHTFULLY MADE</span>

            <h2>Less noise.<br /><span>More possibility.</span></h2>

            <p>The little details make all the difference. Find technology that feels right for you.</p>

            <Link className="light-button" to="/shop">Find your device <span>↗</span></Link>

          </div>

          <div className="story-decoration" aria-hidden="true">n.</div>

          <div className="story-orb" />

        </section>



        <section className="newsletter-strip" data-reveal>

          <div><span className="eyebrow">STAY IN THE KNOW</span><h2>Good things are on the way.</h2><p>Discover new arrivals and thoughtful technology.</p></div>

          <Link className="newsletter-link" to="/shop">Explore NovaTech <span>↗</span></Link>

        </section>

      </main>

      <Footer />

    </div>

  );

}



function ShopPage() {

  const { products, loading, error } = useStoreData();

  useScrollReveal([loading, products.length]);

  return (

    <div className="app">

      <Header />

      <main className="section category-page" data-reveal>

        <div className="category-page-heading"><span className="eyebrow">THE NOVATECH COLLECTION</span><h1>Explore all products.</h1><p>Discover technology designed for your everyday.</p></div>

        <ProductGrid products={products} loading={loading} error={error} />

      </main>

      <Footer />

    </div>

  );

}



function CategoryPage() {

  const { slug } = useParams();

  const navigate = useNavigate();

  const { products, loading, error } = useStoreData();

  const category = DEVICE_CATEGORIES.find((item) => item.slug === slug);



  useEffect(() => {

    if (!category) navigate("/shop", { replace: true });

  }, [category, navigate]);



  useScrollReveal([loading, products.length, slug]);



  const categoryProducts = products.filter((product) => getCategorySlug(product) === slug);

  if (!category) return null;



  return (

    <div className="app">

      <Header />

      <main className="section category-page" data-reveal>

        <div className="category-page-heading">

          <Link to="/shop" className="text-link">← All products</Link>

          <span className="eyebrow">EXPLORE NOVATECH</span>

          <h1>{category.name}.</h1>

          <p>Discover our {category.name.toLowerCase()} collection, thoughtfully selected for your everyday.</p>

        </div>

        <ProductGrid products={categoryProducts} loading={loading} error={error} />

      </main>

      <Footer />

    </div>

  );

}



function AppRoutes() {

  return (

    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/shop" element={<ShopPage />} />

        <Route path="/category/:slug" element={<CategoryPage />} />

        <Route path="/products/:id" element={<ProductDetail />} />

        <Route path="/auth" element={<Auth />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/bag" element={<Bag />} />

        <Route path="*" element={<ShopPage />} />

      </Routes>

    </BrowserRouter>

  );

}



export default AppRoutes;
