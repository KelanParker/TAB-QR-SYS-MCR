import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <h1 className="text-2xl font-bold text-blue-600">
          MCR Tablet Management
        </h1>

        <div className="flex gap-2">

          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/issue" className={linkClass}>
            Issue
          </NavLink>

          <NavLink to="/return" className={linkClass}>
            Return
          </NavLink>

          <NavLink to="/history" className={linkClass}>
            History
          </NavLink>

          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;