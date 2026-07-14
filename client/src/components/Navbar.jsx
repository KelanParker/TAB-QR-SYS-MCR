import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  return (
    <nav className="border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            MCR Tablet Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">

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

          <NavLink to="/activity" className={linkClass}>
            Activity
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