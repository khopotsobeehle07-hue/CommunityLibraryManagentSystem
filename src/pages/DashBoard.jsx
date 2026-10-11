import { useState, useMemo } from "react";
import { useBooks } from "../context/BookContext";
import { CATEGORIES } from "../data/categories";
import BookCard from "../components/BookCard";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { books } = useBooks();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categoryOptions = useMemo(() => {
    const extras = [...new Set(books.map((b) => b.genre))].filter(
      (g) => !CATEGORIES.includes(g)
    );
    return ["All", ...CATEGORIES, ...extras];
  }, [books]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return books.filter((b) => {
      const matchesSearch =
        !term ||
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term) ||
        b.isbn.includes(term);
      const matchesCategory = category === "All" || b.genre === category;
      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  const grouped = useMemo(() => {
    const names = [...new Set([...CATEGORIES, ...filtered.map((b) => b.genre)])];
    return names
      .map((name) => ({ name, items: filtered.filter((b) => b.genre === name) }))
      .filter((group) => group.items.length > 0);
  }, [filtered]);

  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);
  const lowStockCount = books.filter((b) => b.quantity < 2).length;
  const categoriesInUse = new Set(books.map((b) => b.genre)).size;

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="stats">
        <StatCard label="Book titles" value={books.length} />
        <StatCard label="Categories" value={categoriesInUse} />
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>
          ))}
        </select>
      </div>

      {grouped.length === 0 ? (
        <p>{books.length === 0 ? "No books in the library yet." : "No books match your search."}</p>
      ) : (
        grouped.map((group) => (
          <section key={group.name} className="category-section">
            <h3 className="category-title">
              {group.name} <span>({group.items.length})</span>
            </h3>
            <div className="book-grid">
              {group.items.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}