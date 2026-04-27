import { Link, NavLink } from "react-router";
import { 
  BriefcaseBusiness, 
  CircleQuestionMarkIcon, 
  LayoutDashboard,
  PlusCircle,
  Pencil
} from "lucide-react";
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
              Hire-Meet
            </p>
            <p className="text-xs opacity-60 -mt-1">
              Code Together · Get Hired
            </p>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">

          {/* 🔥 Add Question */}
          <NavLink
            to="/adminPannel/add-question"
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg flex items-center gap-x-2.5 transition ${
                isActive
                  ? "bg-green-500 text-black shadow-md"
                  : "hover:bg-base-200 text-base-content/70"
              }`
            }
          >
            <PlusCircle className="size-4" />
            <span className="hidden sm:inline">Add</span>
          </NavLink>

          {/* ✏️ Edit Question */}
          <NavLink
            to="/adminPannel/edit-question"
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg flex items-center gap-x-2.5 transition ${
                isActive
                  ? "bg-yellow-400 text-black shadow-md"
                  : "hover:bg-base-200 text-base-content/70"
              }`
            }
          >
            <Pencil className="size-4" />
            <span className="hidden sm:inline">Edit</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;