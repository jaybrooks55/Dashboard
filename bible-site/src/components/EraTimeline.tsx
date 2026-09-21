import type { TimelineEntry } from "../data/types";
import TimelineEntryCard from "./TimelineEntryCard";

function groupByEra(entries: TimelineEntry[]): { era: string; items: TimelineEntry[] }[] {
  const groups: { era: string; items: TimelineEntry[] }[] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.era === entry.era) {
      last.items.push(entry);
    } else {
      groups.push({ era: entry.era, items: [entry] });
    }
  }
  return groups;
}

export default function EraTimeline({ entries }: { entries: TimelineEntry[] }) {
  const groups = groupByEra(entries);

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.era}>
          <div className="sticky top-14 z-10 -mx-4 mb-6 bg-parchment-50/95 px-4 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8">
            <h2 className="font-display text-center text-lg font-semibold uppercase tracking-[0.2em] text-maroon-700 sm:text-xl">
              {group.era}
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-24 bg-maroon-700/60" />
          </div>

          <ol className="relative border-l-2 border-maroon-700/30 pl-6 sm:pl-10">
            {group.items.map((entry) => (
              <li key={entry.id} className="relative mb-10 last:mb-0">
                <span className="absolute -left-[calc(1.5rem+5px)] top-2 h-3 w-3 rounded-full border-2 border-maroon-700 bg-parchment-50 sm:-left-[calc(2.5rem+5px)]" />
                <TimelineEntryCard entry={entry} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
