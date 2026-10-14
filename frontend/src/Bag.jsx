import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Bag.css";

const STORAGE_KEY = "novatech-bag";

function readBag() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function Bag() {
  const [items, setItems] = useState(readBag);

  useEffect(() => {
    const refresh = () => setItems(readBag());
    window.addEventListener("storage", refresh);
    window.addEventListener("novatech-bag-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("novatech-bag-updated", refresh);
    };
  }, []);

  function saveBag(nextItems) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    setItems(nextItems);
    window.dispatchEvent(new Event("novatech-bag-updated"));
  }

  function changeQuantity(id, amount) {
    saveBag(
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id) {
    saveBag(items.filter((item) => item.id !== id));
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <main className="bag-page">
      <Link to="/shop" className="bag-back">
        ← Continue shopping
      </Link>

      <div className="bag-heading">
        <div>
          <span className="bag-eyebrow">YOUR NOVATECH SELECTION</span>
          <h1>Your bag<span>.</span></h1>
          <p>Thoughtful technology, selected for you.</p>
        </div>
        <span className="bag-count">
          {items.reduce((sum, item) => sum + item.quantity, 0)} items
        </span>
      </div>

      {items.length === 0 ? (
        <section className="bag-empty">
          <div className="bag-empty-icon">⌑</div>
          <h2>Your bag is waiting.</h2>
          <p>Explore our collection and find something you love.</p>
          <Link to="/shop" className="bag-continue-button">
            Explore products ↗
          </Link>
        </section>
      ) : (
        <div className="bag-layout">
          <section className="bag-items">
            {items.map((item) => (
              <article className="bag-item" key={item.id}>
                <Link
                  to={`/products/${item.id}`}
                  className="bag-item-image"
                >
                  <img src={item.image} alt={item.name} />
                </Link>

                <div className="bag-item-info">
                  <span>{item.category || "NovaTech"}</span>
                  <Link
                    to={`/products/${item.id}`}
                    className="bag-item-name"
                  >
                    {item.name}
                  </Link>
                  <strong>{money(item.price)}</strong>

                  <div className="bag-item-actions">
                    <div className="bag-quantity">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="bag-remove"
                      type="button"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <strong className="bag-line-total">
                  {money(Number(item.price) * item.quantity)}
                </strong>
              </article>
            ))}
          </section>

          <aside className="bag-summary">
            <span className="bag-eyebrow">ORDER SUMMARY</span>
            <h2>Almost yours.</h2>

            <div className="bag-summary-row">
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>

            <div className="bag-summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="bag-summary-total">
              <span>Total</span>
              <strong>{money(subtotal)}</strong>
            </div>

            <button
              className="bag-checkout-button"
              type="button"
              onClick={() =>
                alert(
                  "Online checkout is not connected yet. Your bag is saved."
                )
              }
            >
              Continue to checkout ↗
            </button>

            <p className="bag-summary-note">
              Your selection stays saved in this browser.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}