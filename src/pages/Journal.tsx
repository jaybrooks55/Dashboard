import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type JournalEntry = Tables<"journal_entries">;

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("entry_date", { ascending: false })
      .limit(30);
    if (!error) setEntries(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addEntry(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    const { error } = await supabase.from("journal_entries").insert({
      content: content.trim(),
      mood: mood.trim() || null,
    });
    if (!error) {
      setContent("");
      setMood("");
      load();
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">Journal</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Private to you — your partner can't see these entries.
      </p>

      <form onSubmit={addEntry} className="mb-6 space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today?"
          rows={4}
          className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700"
        />
        <div className="flex gap-2">
          <input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Mood (optional)"
            className="flex-1 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Save entry
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-slate-400">No entries yet.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                <span>{entry.entry_date}</span>
                {entry.mood && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">{entry.mood}</span>
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm">{entry.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
