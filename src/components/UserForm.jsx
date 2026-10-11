import { useState, useEffect } from "react";

const EMPTY = { name: "", membershipId: "", role: "member" };

export default function UserForm({ users, editingUser, roles, lockRole, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(editingUser ? { ...editingUser } : { ...EMPTY, role: roles[0] ?? "member" });
    setErrors({});
  }, [editingUser, roles]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    const name = form.name.trim();
    const memberId = form.membershipId.trim();

    if (!name) {
      errs.name = "Name is required.";
    } else if (
      users.some((u) => u.name.toLowerCase() === name.toLowerCase() && u.id !== editingUser?.id)
    ) {
      errs.name = "A user with this name already exists.";
    }

    if (!memberId) {
      errs.membershipId = "Membership ID is required.";
    } else if (
      users.some(
        (u) =>
          u.membershipId.toLowerCase() === memberId.toLowerCase() &&
          u.id !== editingUser?.id
      )
    ) {
      errs.membershipId = "This membership ID is already in use.";
    }

    if (!roles.includes(form.role)) errs.role = "Select a valid role.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      name: form.name.trim(),
      membershipId: form.membershipId.trim(),
      role: form.role,
    });
    setForm({ ...EMPTY, role: roles[0] ?? "member" });
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h3>{editingUser ? "Update User" : "Add New User"}</h3>
      <div className="form-grid">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="membershipId">Membership ID</label>
          <input
            id="membershipId"
            name="membershipId"
            value={form.membershipId}
            onChange={handleChange}
          />
          {errors.membershipId && <p className="field-error">{errors.membershipId}</p>}
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={lockRole || roles.length === 1}
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          {lockRole && <p className="hint">You can't change your own role.</p>}
          {errors.role && <p className="field-error">{errors.role}</p>}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn">{editingUser ? "Save Changes" : "Add User"}</button>
        {editingUser && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}