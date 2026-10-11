import { useState, useEffect } from "react";

export default function TransactionForm({
  books,
  users,
  onSubmit,
  restricted = false,
  memberName = "",
}) {
  const emptyForm = {
    bookId: "",
    type: restricted ? "borrow" : "add",
    quantity: "",
    member: restricted ? memberName : "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const selectedBook = books.find((b) => b.id === Number(form.bookId));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.bookId) errs.bookId = "Select a book.";

    const qty = Number(form.quantity);
    if (form.quantity === "") errs.quantity = "Quantity is required.";
    else if (!Number.isInteger(qty) || qty < 1) errs.quantity = "Enter a whole number of 1 or more.";
    else if (form.type === "borrow" && selectedBook && qty > selectedBook.quantity) {
      errs.quantity = `Only ${selectedBook.quantity} in stock.`;
    }

    if (form.type === "borrow" && !form.member) errs.member = "Select who is borrowing.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const error = onSubmit({
      bookId: Number(form.bookId),
      type: form.type,
      quantity: Number(form.quantity),
      member: form.type === "borrow" ? form.member : "",
    });

    if (error) {
      setErrors({ quantity: error });
      return;
    }

    setMessage(form.type === "add" ? "Stock added successfully." : "Borrowing recorded.");
    setForm({ ...emptyForm, type: form.type });
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h3>{restricted ? "Borrow a Book" : "Record Transaction"}</h3>
      <div className="form-grid">
        <div>
          <label htmlFor="bookId">Book</label>
          <select id="bookId" name="bookId" value={form.bookId} onChange={handleChange}>
            <option value="">-- Select a book --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
          {selectedBook && <p className="hint">Current stock: {selectedBook.quantity}</p>}
          {errors.bookId && <p className="field-error">{errors.bookId}</p>}
        </div>

        {!restricted && (
          <div>
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={form.type} onChange={handleChange}>
              <option value="add">Add stock (new arrival)</option>
              <option value="borrow">Deduct stock (borrowed)</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <p className="field-error">{errors.quantity}</p>}
        </div>

        {!restricted && form.type === "borrow" && (
          <div>
            <label htmlFor="member">Borrowed by</label>
            <select id="member" name="member" value={form.member} onChange={handleChange}>
              <option value="">-- Select member --</option>
              {users.map((u) => (
                <option key={u.id} value={u.name}>{u.name} ({u.membershipId})</option>
              ))}
            </select>
            {errors.member && <p className="field-error">{errors.member}</p>}
          </div>
        )}
      </div>

      {restricted && <p className="hint">Borrowing as {memberName}.</p>}
      {message && <p className="success">{message}</p>}
      <button type="submit" className="btn">
        {restricted ? "Borrow" : "Record Transaction"}
      </button>
    </form>
  );
}