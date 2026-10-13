
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = "http://127.0.0.1:8000/api/auth";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          navigate("/auth");
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch {
        setError("Unable to connect to the server. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  async function handleLogout() {
    const token = localStorage.getItem("authToken");

    try {
      if (token) {
        await fetch(`${API_URL}/logout/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      }
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      navigate("/auth");
    }
  }

  if (loading) {
    return <main className="profile-page">Loading profile...</main>;
  }

  return (
    <main className="profile-page">
      <header className="profile-header">
        <Link to="/" className="profile-brand">
          NOVATECH<span>.</span>
        </Link>
        <Link to="/" className="profile-home">Home</Link>
      </header>

      <section className="profile-card">
        <div className="profile-avatar">
          {user?.username?.charAt(0).toUpperCase()}
        </div>

        <h1>My Account</h1>
        {error ? (
          <p role="alert">{error}</p>
        ) : user ? (
          <>
            <p className="profile-welcome">
              Welcome, {user.username}!
            </p>

            <div className="profile-info">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email || "Not provided"}</p>
            </div>

            <button className="profile-logout" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : null}
      </section>
    </main>
  );
}

export default Profile;
