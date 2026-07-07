import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type CalendarEvent = Tables<"calendar_events">;
type DispatchFlag = Tables<"dispatch_flags">;

// Small offline rotation so the daily verse always has something to show
// without needing an API key. Swap for a live Bible API call once one is
// chosen (see README "Integrations").
const VERSES = [
  { ref: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble." },
  { ref: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart, and do not lean on your own understanding." },
  { ref: "Philippians 4:6-7", text: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God." },
  { ref: "Lamentations 3:22-23", text: "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning." },
  { ref: "Isaiah 41:10", text: "Fear not, for I am with you; be not dismayed, for I am your God." },
  { ref: "Joshua 1:9", text: "Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go." },
  { ref: "Romans 8:28", text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose." },
];

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function DailyBriefing() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [flags, setFlags] = useState<DispatchFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const [{ data: eventData }, { data: flagData }] = await Promise.all([
        supabase
          .from("calendar_events")
          .select("*")
          .gte("start_time", startOfDay.toISOString())
          .lte("start_time", endOfDay.toISOString())
          .order("start_time", { ascending: true }),
        supabase
          .from("dispatch_flags")
          .select("*")
          .order("received_at", { ascending: false })
          .limit(5),
      ]);
      setEvents(eventData ?? []);
      setFlags(flagData ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const verse = VERSES[dayOfYear() % VERSES.length];

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-semibold">
        Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Today's Schedule</h2>
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-slate-400">Nothing on the calendar today.</p>
          ) : (
            <ul className="space-y-1">
              {events.map((event) => (
                <li key={event.id} className="flex gap-2 text-sm">
                  <span className="w-16 shrink-0 text-slate-400">
                    {event.all_day
                      ? "All day"
                      : new Date(event.start_time).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                  </span>
                  <span>{event.title}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/calendar" className="mt-3 inline-block text-xs text-brand-600 hover:underline">
            View calendar &rarr;
          </Link>
        </section>

        <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Weather</h2>
          <p className="text-sm text-slate-400">
            Not connected yet. Add a weather API key to enable this — see README.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Daily Verse</h2>
          <p className="mb-1 text-sm italic">&ldquo;{verse.text}&rdquo;</p>
          <p className="text-xs text-slate-400">{verse.ref}</p>
        </section>

        <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Flagged: The Dispatch
          </h2>
          {flags.length === 0 ? (
            <p className="text-sm text-slate-400">
              No flagged emails yet. Gmail isn't connected — see README "Integrations".
            </p>
          ) : (
            <ul className="space-y-1">
              {flags.map((flag) => (
                <li key={flag.id} className="text-sm">
                  {flag.subject}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
