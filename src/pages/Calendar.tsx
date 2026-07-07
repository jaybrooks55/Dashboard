import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type CalendarEvent = Tables<"calendar_events">;

function groupByDay(events: CalendarEvent[]) {
  const groups = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const day = new Date(event.start_time).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(event);
  }
  return groups;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .gte("start_time", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
      .order("start_time", { ascending: true })
      .limit(50);
    if (!error) setEvents(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addEvent(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startTime) return;
    const { error } = await supabase.from("calendar_events").insert({
      title: title.trim(),
      start_time: new Date(startTime).toISOString(),
      source: "manual",
    });
    if (!error) {
      setTitle("");
      setStartTime("");
      load();
    }
  }

  const grouped = groupByDay(events);

  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <button
          disabled
          title="Google/Outlook OAuth sync is not wired up yet — see README"
          className="cursor-not-allowed rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-400 dark:border-slate-700"
        >
          Connect Google/Outlook
        </button>
      </div>

      <form onSubmit={addEvent} className="mb-6 flex flex-wrap gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title..."
          className="flex-1 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700"
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : grouped.size === 0 ? (
        <p className="text-sm text-slate-400">No upcoming events.</p>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([day, dayEvents]) => (
            <div key={day}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{day}</p>
              <ul className="space-y-1">
                {dayEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800"
                  >
                    <span className="w-16 shrink-0 text-xs text-slate-400">
                      {event.all_day
                        ? "All day"
                        : new Date(event.start_time).toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                    </span>
                    <span className="flex-1">{event.title}</span>
                    {event.source !== "manual" && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase text-slate-500 dark:bg-slate-800">
                        {event.source}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
