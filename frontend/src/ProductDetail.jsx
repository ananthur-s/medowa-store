import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProductDetail.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api`;

function getProductImage(product) {
  const name = (product?.name || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .trim();

  const localImages = [
    ["nova lite", "/images/nova_lite_1.png"],
    ["nova pro 2", "/images/nova_pro2_front.png"],
    ["nova pro2", "/images/nova_pro2_front.png"],
    ["nova pro", "/images/novapro.jpg"],
    ["nova watch ultra", "/images/nova_ultra_front.jpg"],
    ["nova watch pro", "/images/nova_watchpro_front.jpg"],
    ["nova watch", "/images/nova_watch_front.jpg"],
    ["nova tv 55", "/images/nova_tv55_front.jpg"],
    ["nova monitor", "/images/nova_monitor_front.jpg"],
    ["nova headphones", "/images/nova_headphones_front.jpg"],
    ["nova buds", "/images/nova_buds_front.jpg"],
    ["nova sound", "/images/nova_sound_front.jpg"],
  ];

  const match = localImages.find(([term]) => name.includes(term));

  if (match) {
    return match[1];
  }

  const image = product?.image;

  if (!image) {
    return "";
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_BASE_URL}${image}`;
  }

  return `${API_BASE_URL}/media/${image.replace(/^\/+/, "")}`;
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const response = await fetch(`${API_URL}/products/${id}/`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Product not found."
              : "Unable to load this product. Please try again."
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Product detail error:", err);

        if (!cancelled) {
          setError(err.message || "Unable to load this product.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));

  if (loading) {
    return (
      <main className="detail-message">
        Loading product...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="detail-message">
        <h2>{error || "Product not found."}</h2>
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
          <img
            src={getProductImage(product)}
            alt={product.name}
            onError={(event) => {
              const image = product.image;

              if (
                image &&
                event.currentTarget.src !== image
              ) {
                event.currentTarget.onerror = null;
                event.currentTarget.src = image;
              }
            }}
          />
        </div>

        <div className="detail-information">
          <span className="detail-eyebrow">
            {product.category?.name || "Technology"}
          </span>

          <h1>{product.name}</h1>

          <p className="detail-price">
            {formatPrice(product.price)}
          </p>

          <p className="detail-description">
            {product.description}
          </p>

          <p className="detail-availability">
            <span className="detail-status-dot" />
            Available
          </p>

          <button
  className="detail-buy-button"
  type="button"
  onClick={() => {
    const key = "novatech-bag";

    let bag = [];

    try {
      bag = JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      bag = [];
    }

    const item = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: getProductImage(product),
      category: product.category?.name || "Technology",
      quantity: 1,
    };

    const existing = bag.find((entry) => entry.id === item.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      bag.push(item);
    }

    localStorage.setItem(key, JSON.stringify(bag));
    window.dispatchEvent(new Event("novatech-bag-updated"));

    window.location.href = "/bag";
  }}
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