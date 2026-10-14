
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/auth`;

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const endpoint = isLogin ? "login/" : "register/";

    const body = isLogin
      ? { username, password }
      : { username, email, password };

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        const errors =
          typeof data === "object" && data !== null
            ? Object.values(data).flat().join(" ")
            : "";

        throw new Error(errors || "Something went wrong.");
      }

      if (!data.token) {
        throw new Error("Login succeeded, but no authentication token was returned.");
      }

      localStorage.setItem("authToken", data.token);

      if (data.user) {
        localStorage.setItem("authUser", JSON.stringify(data.user));
      }

      navigate("/profile");
    } catch (error) {
      console.error("Authentication error:", error);
      setMessage(
        error.message || "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <Link to="/" className="auth-brand">
        NOVATECH<span>.</span>
      </Link>

      <section className="auth-card">
        <h1>{isLogin ? "Welcome back." : "Create your account."}</h1>

        <p className="auth-description">
          {isLogin
            ? "Sign in to continue to NovaTech."
            : "Join NovaTech to get started."}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
          >
            Login
          </button>

          <button
            type="button"
            className={!isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />

          {!isLogin && (
            <>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </>
          )}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />

          {message && (
            <p className="auth-message" role="alert">
              {message}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "New to NovaTech?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </section>
    </main>
  );
}

export default Auth;
