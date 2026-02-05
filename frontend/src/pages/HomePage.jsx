import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  Code2Icon,
  BriefcaseBusiness,
  ZapIcon,
  VideoIcon,
  UsersIcon,
  CheckIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import toast, { ToastBar } from "react-hot-toast";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral to-black text-base-content">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="size-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <BriefcaseBusiness className="size-6 text-black" />
            </div>
            <div>
              <p className="text-xl font-black tracking-wide text-primary font-mono">
                HireMeet
              </p>
              <p className="text-xs opacity-60 -mt-1">
                Code Together - Get Hired
              </p>
            </div>
          </Link>

          <SignInButton mode="modal">
            <button className="btn btn-primary btn-sm gap-2 shadow-lg font-bold">
              Get Started
              <ArrowRightIcon className="size-4" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-10">
            <div className="badge badge-primary badge-outline gap-2 px-4 py-3">
              <ZapIcon className="size-4" />
              Real-time Collaboration
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="text-primary">Code Together,</span>
              <br />
              <span className="text-base-content/90">Learn Together</span>
            </h1>

            <p className="text-lg text-base-content/70 max-w-xl leading-relaxed">
              A premium platform for collaborative coding interviews and pair
              programming with real-time video and shared editors.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4">
              {["Live Video", "Code Editor", "Multi-Language"].map((text) => (
                <span
                  key={text}
                  className="badge badge-outline badge-lg gap-2 px-5 py-3"
                >
                  <CheckIcon className="size-4 text-primary" />
                  {text}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-5">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-lg gap-2 shadow-xl">
                  Start Coding
                  <ArrowRightIcon className="size-5" />
                </button>
              </SignInButton>

              <button
                className="btn btn-outline btn-lg gap-2"
                onClick={() =>
                  toast("Comming Soon !", {
                    icon: "🎥",
                  })
                }
              >
                <VideoIcon className="size-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="stats bg-black/60 border border-primary/10 shadow-xl">
              <div className="stat">
                <div className="stat-value text-primary">10K+</div>
                <div className="stat-title opacity-70">Users</div>
              </div>
              <div className="stat">
                <div className="stat-value text-primary">50K+</div>
                <div className="stat-title opacity-70">Sessions</div>
              </div>
              <div className="stat">
                <div className="stat-value text-primary">99.9%</div>
                <div className="stat-title opacity-70">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right */}
          <img
            src="/hero.png"
            alt="Platform Preview"
            className="rounded-3xl border border-primary/20 shadow-2xl shadow-primary/10 hover:scale-[1.02] transition duration-500"
          />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-base-content/60 mt-4 max-w-xl mx-auto">
            Designed for modern technical interviews and real-world
            collaboration
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "HD Video Call",
              icon: VideoIcon,
              desc: "Crystal clear audio & video experience",
            },
            {
              title: "Live Code Editor",
              icon: Code2Icon,
              desc: "Real-time collaborative coding",
            },
            {
              title: "Easy Collaboration",
              icon: UsersIcon,
              desc: "Screen sharing & instant discussion",
            },
          ].map(({ title, icon: Icon, desc }) => (
            <div
              key={title}
              className="card bg-black/60 border border-primary/10 hover:border-primary/40 transition shadow-xl"
            >
              <div className="card-body items-center text-center">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="size-8 text-primary" />
                </div>
                <h3 className="card-title text-lg">{title}</h3>
                <p className="text-base-content/60">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
