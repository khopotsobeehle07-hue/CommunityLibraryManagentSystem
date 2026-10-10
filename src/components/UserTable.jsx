export default function UserTable({ users, currentUserId, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Membership ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {user.name}
                {user.id === currentUserId && <span className="you-tag"> (you)</span>}
              </td>
              <td>{user.membershipId}</td>
              <td>
                <span className={`badge badge-role-${user.role}`}>{user.role}</span>
              </td>
              <td className="actions">
                <button className="btn btn-small" onClick={() => onEdit(user)}>Update</button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => onDelete(user)}
                  disabled={user.id === currentUserId}
                  title={user.id === currentUserId ? "You can't delete your own account" : ""}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}