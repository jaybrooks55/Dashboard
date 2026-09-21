import type { ReactNode } from "react";

export default function BibleLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="relative -m-6 min-h-[calc(100vh-3.5rem)] overflow-hidden px-4 py-10 font-serif text-maroon-900 sm:px-8 md:py-14"
      style={{
        backgroundColor: "#fbf7ee",
        backgroundImage:
          "radial-gradient(ellipse at 15% 10%, rgba(189,148,87,0.16) 0%, transparent 45%)," +
          "radial-gradient(ellipse at 85% 20%, rgba(122,31,31,0.08) 0%, transparent 40%)," +
          "radial-gradient(ellipse at 50% 90%, rgba(189,148,87,0.14) 0%, transparent 55%)," +
          "repeating-linear-gradient(0deg, rgba(58,47,34,0.025) 0px, rgba(58,47,34,0.025) 1px, transparent 1px, transparent 3px)",
      }}
    >
      {/* Ornamental corner flourishes */}
      <div className="pointer-events-none absolute left-3 top-3 h-14 w-14 border-l-4 border-t-4 border-maroon-700/40 sm:left-6 sm:top-6" />
      <div className="pointer-events-none absolute right-3 top-3 h-14 w-14 border-r-4 border-t-4 border-maroon-700/40 sm:right-6 sm:top-6" />
      <div className="pointer-events-none absolute bottom-3 left-3 h-14 w-14 border-b-4 border-l-4 border-maroon-700/40 sm:bottom-6 sm:left-6" />
      <div className="pointer-events-none absolute bottom-3 right-3 h-14 w-14 border-b-4 border-r-4 border-maroon-700/40 sm:bottom-6 sm:right-6" />

      <div className="relative mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.35em] text-maroon-600">The Bible</p>
          <h1 className="font-display text-3xl font-semibold tracking-wide text-maroon-800 sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-maroon-700/50" />
            <span className="text-maroon-600">&#10022;</span>
            <span className="h-px w-16 bg-maroon-700/50" />
          </div>
          {subtitle ? (
            <p className="mx-auto mt-5 max-w-2xl text-base italic leading-relaxed text-maroon-800/80 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
