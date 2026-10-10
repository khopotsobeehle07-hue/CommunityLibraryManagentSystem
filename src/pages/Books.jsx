import { useState } from "react";
import BookForm from "../context/BookForm";
import BookTable from "../context/BookTable";
import { useBooks } from "../hooks/useBooks";

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