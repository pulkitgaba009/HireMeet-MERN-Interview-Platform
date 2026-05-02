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
          : "text-[#aaa] hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="shrink-0 border-b border-[#2d2d2d] bg-[#1a1a1a] px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
          <div className="size-9 rounded-lg bg-primary flex items-center justify-center">
            <BriefcaseBusiness className="size-5 text-primary-content" />
          </div>
          <div>
            <p className="text-base font-bold text-white leading-tight">Hire-Meet</p>
            <p className="text-[10px] text-[#888] leading-tight">Code Together</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-1 rounded-lg bg-[#252525] p-1 max-w-full">
          {tab("document", "Document")}
          {tab("both", "Both")}
          {tab("canvas", "Canvas")}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <NavLink
            to="/problems"
            className={({ isActive }) =>
              `hidden md:inline-flex px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-primary text-primary-content" : "text-[#ccc] hover:bg-white/5"
              }`
            }
          >
            <span className="flex items-center gap-2">
              <CircleQuestionMarkIcon className="size-4" />
              Problems
            </span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `hidden md:inline-flex px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-primary text-primary-content" : "text-[#ccc] hover:bg-white/5"
              }`
            }
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="size-4" />
              Dashboard
            </span>
          </NavLink>
          <UserButton
            appearance={{
              elements: { avatarBox: "size-9 ring-2 ring-[#333]" },
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
