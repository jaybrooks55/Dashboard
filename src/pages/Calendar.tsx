import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type CalendarEvent = Tables<"calendar_events">;
type GoogleCalendarOption = { id: string; summary: string; primary: boolean };

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
  const [searchParams, setSearchParams] = useSearchParams();

  const [googleEmail, setGoogleEmail] = useState<string | null | undefined>(undefined);
  const [connecting, setConnecting] = useState(false);
  const [calendarOptions, setCalendarOptions] = useState<GoogleCalendarOption[] | null>(null);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [googleMessage, setGoogleMessage] = useState<string | null>(null);

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

  async function loadConnectionStatus() {
    const { data } = await supabase
      .from("oauth_connections")
      .select("external_account_email")
      .eq("provider", "google_calendar")
      .maybeSingle();
    setGoogleEmail(data?.external_account_email ?? null);
  }

  async function loadCalendarOptions() {
    const { data, error } = await supabase.functions.invoke("google-calendar-list");
    if (error || !data) {
      setGoogleMessage("Couldn't load your Google calendars.");
      return;
    }
    setCalendarOptions(data.calendars);
    setSelectedCalendarIds(data.selected ?? []);
  }

  useEffect(() => {
    load();
    loadConnectionStatus();
  }, []);

  useEffect(() => {
    const googleParam = searchParams.get("google");
    if (googleParam === "connected") {
      loadConnectionStatus();
      loadCalendarOptions();
      setSearchParams({}, { replace: true });
    } else if (googleParam === "denied") {
      setGoogleMessage("Google Calendar access was denied.");
      setSearchParams({}, { replace: true });
    } else if (googleParam === "error") {
      setGoogleMessage("Something went wrong connecting Google Calendar. Please try again.");
      setSearchParams({}, { replace: true });
    }
    // Only run once on mount to consume the redirect params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function handleConnect() {
    setConnecting(true);
    setGoogleMessage(null);
    const { data, error } = await supabase.functions.invoke("google-oauth-start");
    setConnecting(false);
    if (error || !data?.url) {
      setGoogleMessage("Couldn't start the Google connection.");
      return;
    }
    window.location.href = data.url;
  }

  function toggleCalendar(id: string) {
    setSelectedCalendarIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function saveSelectionAndSync() {
    setSyncing(true);
    setGoogleMessage(null);
    await supabase.functions.invoke("google-calendar-select", { body: { calendarIds: selectedCalendarIds } });
    await runSync();
    setCalendarOptions(null);
    setSyncing(false);
  }

  async function runSync() {
    const { data, error } = await supabase.functions.invoke("google-calendar-sync");
    if (error) {
      setGoogleMessage("Sync failed.");
      return;
    }
    setGoogleMessage(`Synced ${data?.synced ?? 0} event(s).`);
    load();
  }

  async function handleSyncNow() {
    setSyncing(true);
    setGoogleMessage(null);
    await runSync();
    setSyncing(false);
  }

  const grouped = groupByDay(events);

  return (
    <div className="max-w-2xl">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        {googleEmail === undefined ? null : googleEmail !== null ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Connected: {googleEmail}</span>
            <button
              onClick={loadCalendarOptions}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Manage calendars
            </button>
            <button
              onClick={handleSyncNow}
              disabled={syncing}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {syncing ? "Syncing..." : "Sync now"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {connecting ? "Connecting..." : "Connect Google Calendar"}
          </button>
        )}
      </div>

      {googleMessage && <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{googleMessage}</p>}

      {calendarOptions && (
        <div className="mb-6 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="mb-2 text-sm font-semibold">Choose which calendars to sync</h2>
          {calendarOptions.length === 0 ? (
            <p className="text-sm text-slate-400">No calendars found on this Google account.</p>
          ) : (
            <ul className="mb-3 space-y-1">
              {calendarOptions.map((cal) => (
                <li key={cal.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCalendarIds.includes(cal.id)}
                    onChange={() => toggleCalendar(cal.id)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  <span>
                    {cal.summary}
                    {cal.primary ? " (primary)" : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={saveSelectionAndSync}
            disabled={syncing}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {syncing ? "Saving..." : "Save & sync"}
          </button>
        </div>
      )}

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
