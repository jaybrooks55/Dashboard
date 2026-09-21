import { NavLink } from "react-router-dom";

const NAV_ITEMS: { to: string; label: string }[] = [
  { to: "/", label: "Home" },
  { to: "/old-testament", label: "Old Testament" },
  { to: "/new-testament", label: "New Testament" },
  { to: "/people", label: "Key People" },
  { to: "/lineage", label: "Lineage of Jesus" },
];

export default function NavHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-maroon-700/25 bg-parchment-50/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-1 gap-y-2 px-4 py-3 sm:justify-between sm:px-8">
        <NavLink
          to="/"
          className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-maroon-800"
        >
          The Bible
        </NavLink>
        <nav className="flex flex-wrap items-center justify-center gap-1">
          {NAV_ITEMS.slice(1).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 font-display text-xs uppercase tracking-wide transition-colors sm:text-sm ${
                  isActive
                    ? "bg-maroon-700 text-parchment-50"
                    : "text-maroon-800 hover:bg-maroon-700/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
