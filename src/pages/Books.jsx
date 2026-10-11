import { useState } from "react";
import { useBooks } from "../context/BookContext";
import { CATEGORIES } from "../data/categories";

export default function Books() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const [editingBook, setEditingBook] = useState(null);

  const handleSubmit = (book) => {
    if (editingBook) {
      updateBook(editingBook.id, book);
      setEditingBook(null);
      return;
    }

    addBook(book);
  };

  const handleDelete = (book) => {
    if (window.confirm(`Delete "${book.title}" from the catalog?`)) {
      deleteBook(book.id);
      if (editingBook?.id === book.id) setEditingBook(null);
    }
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CATALOG</p>
          <h2>Book management</h2>
        </div>
        <span className="count-label">{books.length} titles</span>
      </div>
      <BookForm
        key={editingBook?.id ?? "new-book"}
        books={books}
        editingBook={editingBook}
        onSubmit={handleSubmit}
        onCancel={() => setEditingBook(null)}
      />
      <section className="list-section">
        <h3>Library catalog</h3>
        <BookTable books={books} onEdit={setEditingBook} onDelete={handleDelete} />
      </section>
    </section>
  );
}

const EMPTY_BOOK = { title: "", author: "", genre: "", isbn: "", quantity: "" };

function BookForm({ books, editingBook, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    editingBook ? { ...editingBook, quantity: String(editingBook.quantity) } : EMPTY_BOOK
  );
  const [errors, setErrors] = useState({});

  const categoryOptions =
    editingBook && !CATEGORIES.includes(editingBook.genre)
      ? [...CATEGORIES, editingBook.genre]
      : CATEGORIES;

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: "" });
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!form.author.trim()) nextErrors.author = "Author is required.";
    if (!form.genre) nextErrors.genre = "Select a category.";

    const cleanIsbn = form.isbn.replace(/[-\s]/g, "");
    if (!cleanIsbn) {
      nextErrors.isbn = "ISBN is required.";
    } else if (!/^(\d{10}|\d{13})$/.test(cleanIsbn)) {
      nextErrors.isbn = "ISBN must be 10 or 13 digits.";
    } else if (books.some((book) => book.isbn === cleanIsbn && book.id !== editingBook?.id)) {
      nextErrors.isbn = "A book with this ISBN already exists.";
    }

    if (!editingBook) {
      const quantity = Number(form.quantity);
      if (form.quantity === "") nextErrors.quantity = "Quantity is required.";
      else if (!Number.isInteger(quantity) || quantity < 0) {
        nextErrors.quantity = "Enter a whole number, 0 or more.";
      }
    }
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    const book = {
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre,
      isbn: form.isbn.replace(/[-\s]/g, ""),
    };
    if (!editingBook) book.quantity = Number(form.quantity);
    onSubmit(book);
    setForm(EMPTY_BOOK);
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
          <label htmlFor="genre">Genre (Category)</label>
          <select id="genre" name="genre" value={form.genre} onChange={handleChange}>
            <option value="">-- Select a category --</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
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

function BookTable({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p>No books yet. Add one using the form above.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.isbn}</td>
              <td>{book.quantity}</td>
              <td className="actions">
                <button className="btn btn-small" onClick={() => onEdit(book)}>Update</button>
                <button className="btn btn-small btn-danger" onClick={() => onDelete(book)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}