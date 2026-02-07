import { Link, NavLink } from "react-router";
import { BriefcaseBusiness, CircleQuestionMarkIcon, LayoutDashboard } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function NavBar() {
  return (
    <nav className="bg-black border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="size-11 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-105 transition">
            <BriefcaseBusiness className="size-6 text-black" />
          </div>

          <div>
            <p className="text-xl font-black tracking-wide text-primary font-mono">
              HireMeet
            </p>
            <p className="text-xs opacity-60 -mt-1">
              Code Together · Get Hired
            </p>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <NavLink
            to="/problems"
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-x-2.5 ${
                isActive
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-200 text-base-content/70"
              }`
            }
          >
            <CircleQuestionMarkIcon className="size-4" />
            <span className="font-medium hidden sm:inline">
              Problems
            </span>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-x-2.5 ${
                isActive
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-200 text-base-content/70"
              }`
            }
          >
            <LayoutDashboard className="size-4" />
            <span className="font-medium hidden sm:inline">
              Dashboard
            </span>
          </NavLink>
            <div className="ml-4">

            </div>
          <UserButton/>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
