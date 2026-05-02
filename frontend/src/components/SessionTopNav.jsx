import { Link, NavLink } from "react-router";
import {
  BriefcaseBusiness,
  CircleQuestionMarkIcon,
  LayoutDashboard,
  Share2Icon,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import toast from "react-hot-toast";

function SessionTopNav({ viewMode, onViewModeChange }) {
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Session link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const tab = (id, label) => (
    <button
      type="button"
      onClick={() => onViewModeChange(id)}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
        viewMode === id
          ? "bg-primary text-primary-content"
          : "text-base-content/70 hover:text-base-content hover:bg-base-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="shrink-0 bg-black border-b border-primary/20 shadow-lg">
      <div className="max-w-[100vw] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-3 shrink-0 group">
          <div className="size-9 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-105 transition">
            <BriefcaseBusiness className="size-5 text-primary-content" />
          </div>
          <div>
            <p className="text-base font-black tracking-wide text-primary font-mono leading-tight">
              Hire-Meet
            </p>
            <p className="text-xs opacity-60 -mt-0.5">
              Code Together · Get Hired
            </p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-1 rounded-lg bg-base-200/40 p-1 max-w-full border border-base-300/30">
          {tab("document", "Document")}
          {tab("both", "Both")}
          {tab("canvas", "Canvas")}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <NavLink
            to="/problems"
            className={({ isActive }) =>
              `hidden md:inline-flex px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 items-center gap-2 ${
                isActive
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-200 text-base-content/70"
              }`
            }
          >
            <CircleQuestionMarkIcon className="size-4" />
            Problems
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `hidden md:inline-flex px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 items-center gap-2 ${
                isActive
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-200 text-base-content/70"
              }`
            }
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </NavLink>
          <UserButton
            appearance={{
              elements: { avatarBox: "size-9 ring-2 ring-primary/30" },
            }}
          />
          <button
            type="button"
            onClick={copyShareLink}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Share2Icon className="size-4" />
            Share
          </button>
        </div>
      </div>
    </header>
  );
}

export default SessionTopNav;
