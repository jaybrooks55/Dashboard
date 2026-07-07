import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";

// Full smart-routing (via the Anthropic API, deciding whether input is a
// to-do, calendar event, journal entry, etc.) is not wired up yet — see
// README "Quick capture routing". Until an Edge Function + ANTHROPIC_API_KEY
// are configured, everything captured here is saved as a quick note so
// nothing gets lost.
export default function QuickCaptureBar() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setStatus("saving");
    await supabase.from("notes").insert({ content: value.trim() });
    setValue("");
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Quick capture — jot anything, sort it out later..."
        className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-brand-500 dark:border-slate-700"
      />
      {status === "saved" && (
        <p className="mt-1 text-xs text-brand-600">Saved to Notes.</p>
      )}
    </form>
  );
}
