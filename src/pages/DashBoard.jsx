import { useState, useMemo } from "react";
import { useBooks } from "../context/BookContext";
import BookCard from "../components/BookCard";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { books } = useBooks();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");

  const genres = useMemo(
    () => ["All", ...new Set(books.map((b) => b.genre))],
    [books]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return books.filter((b) => {
      const matchesSearch =
        !term ||
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term) ||
        b.isbn.includes(term);
      const matchesGenre = genre === "All" || b.genre === genre;
      return matchesSearch && matchesGenre;
    });
  }, [books, search, genre]);

  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);
  const lowStockCount = books.filter((b) => b.quantity < 2).length;

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="stats">
        <StatCard label="Book titles" value={books.length} />
        <StatCard label="Total copies in stock" value={totalCopies} />
        <StatCard label="Low stock titles" value={lowStockCount} warning={lowStockCount > 0} />
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Search by title, author or ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search books"
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} aria-label="Filter by genre">
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>{books.length === 0 ? "No books in the library yet." : "No books match your search."}</p>
      ) : (
        <div className="book-grid">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}