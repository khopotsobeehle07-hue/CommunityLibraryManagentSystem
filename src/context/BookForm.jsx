import { useState } from "react";

const EMPTY = { title: "", author: "", genre: "", isbn: "", quantity: "" };

export default function BookForm({ books, editingBook, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => (
    editingBook ? { ...editingBook, quantity: String(editingBook.quantity) } : EMPTY
  ));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.author.trim()) errs.author = "Author is required.";
    if (!form.genre.trim()) errs.genre = "Genre is required.";

    const cleanIsbn = form.isbn.replace(/[-\s]/g, "");
    if (!cleanIsbn) {
      errs.isbn = "ISBN is required.";
    } else if (!/^(\d{10}|\d{13})$/.test(cleanIsbn)) {
      errs.isbn = "ISBN must be 10 or 13 digits.";
    } else if (books.some((b) => b.isbn === cleanIsbn && b.id !== editingBook?.id)) {
      errs.isbn = "A book with this ISBN already exists.";
    }

    if (!editingBook) {
      const qty = Number(form.quantity);
      if (form.quantity === "") errs.quantity = "Quantity is required.";
      else if (!Number.isInteger(qty) || qty < 0) errs.quantity = "Enter a whole number, 0 or more.";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const book = {
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      isbn: form.isbn.replace(/[-\s]/g, ""),
    };
    if (!editingBook) book.quantity = Number(form.quantity);
    onSubmit(book);
    setForm(EMPTY);
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h3>{editingBook ? "Update Book" : "Add New Book"}</h3>
      <div className="form-grid">
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} />
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <input id="author" name="author" value={form.author} onChange={handleChange} />
          {errors.author && <p className="field-error">{errors.author}</p>}
        </div>
        <div>
          <label htmlFor="genre">Genre</label>
          <input id="genre" name="genre" value={form.genre} onChange={handleChange} />
          {errors.genre && <p className="field-error">{errors.genre}</p>}
        </div>
        <div>
          <label htmlFor="isbn">ISBN</label>
          <input id="isbn" name="isbn" value={form.isbn} onChange={handleChange} />
          {errors.isbn && <p className="field-error">{errors.isbn}</p>}
        </div>
        {!editingBook && (
          <div>
            <label htmlFor="quantity">Initial Quantity</label>
            <input id="quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} />
            {errors.quantity && <p className="field-error">{errors.quantity}</p>}
          </div>
        )}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn">{editingBook ? "Save Changes" : "Add Book"}</button>
        {editingBook && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}