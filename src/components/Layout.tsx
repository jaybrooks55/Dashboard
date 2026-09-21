import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";
import QuickCaptureBar from "./QuickCaptureBar";

const navGroups: { label: string; items: { to: string; label: string }[] }[] = [
  {
    label: "Shared",
    items: [
      { to: "/", label: "Daily Briefing" },
      { to: "/todos", label: "To-Do List" },
      { to: "/calendar", label: "Calendar" },
    ],
  },
  {
    label: "Personal",
    items: [
      { to: "/journal", label: "Journal" },
      { to: "/habits", label: "Habits" },
      { to: "/notes", label: "Notes" },
      { to: "/reading", label: "Reading" },
      { to: "/exercise", label: "Exercise" },
      { to: "/meals", label: "Meals" },
    ],
  },
  {
    label: "Focus & Memory",
    items: [
      { to: "/focus", label: "Focus Timer" },
      { to: "/reminders", label: "Reminders" },
      { to: "/weekly-review", label: "Weekly Review" },
      { to: "/recap", label: "Daily Recap" },
    ],
  },
];

export default function Layout() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-slate-200 p-4 dark:border-slate-800">
        <h2 className="mb-6 px-2 text-lg font-semibold">Dashboard</h2>
        <nav className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `block rounded-lg px-2 py-1.5 text-sm ${
                        isActive
                          ? "bg-brand-600 text-white"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3 dark:border-slate-800">
          <QuickCaptureBar />
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
