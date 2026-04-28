import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6">
      {/* Active Count */}
      <div className="card bg-neutral/70 backdrop-blur border-2 border-primary/20 hover:border-primary/40 shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
        <div className="card-body relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <UsersIcon className="w-7 h-7 text-primary" />
            </div>
            <div className="badge badge-primary">Live</div>
          </div>
          <div className="text-4xl font-black mb-1">{activeSessionsCount}</div>
          <div className="text-sm opacity-60">Active Sessions</div>
        </div>
      </div>

      {/* Recent Count */}
      <div className="card bg-neutral/70 backdrop-blur border-2 border-secondary/20 hover:border-secondary/40 shadow-xl hover:shadow-secondary/20 transition-all duration-300 hover:-translate-y-1">
        <div className="card-body relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-secondary/10 rounded-2xl">
              <TrophyIcon className="w-7 h-7 text-secondary" />
            </div>
          </div>
          <div className="text-4xl font-black mb-1">{recentSessionsCount}</div>
          <div className="text-sm opacity-60">Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
