import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", membershipId: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.membershipId.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    if (login(form.name, form.membershipId)) {
      navigate("/");
    } else {
      setError("Invalid name or membership ID.");
    }
  };

  return (
    <div className="card login-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} />

        <label htmlFor="membershipId">Membership ID</label>
        <input
          id="membershipId"
          name="membershipId"
          value={form.membershipId}
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">Log in</button>
      </form>
      <p className="muted-copy demo-hint">Demo administrator: Admin / ADMIN001</p>
    </div>
  );
}