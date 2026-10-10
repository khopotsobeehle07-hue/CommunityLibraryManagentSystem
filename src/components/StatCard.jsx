export default function StatCard({ label, value, warning = false }) {
  return (
    <div className={`stat-card ${warning ? "stat-warning" : ""}`}>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}