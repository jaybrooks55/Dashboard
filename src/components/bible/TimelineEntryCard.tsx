import type { TimelineEntry } from "../../data/bible/types";

export default function TimelineEntryCard({ entry }: { entry: TimelineEntry }) {
  return (
    <article className="relative rounded-sm border border-maroon-700/25 bg-parchment-50/90 p-5 shadow-[0_2px_10px_rgba(74,14,14,0.08)] sm:p-7">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-xs uppercase tracking-[0.2em] text-maroon-600">{entry.approxDate}</span>
        <span className="text-maroon-700/40">&middot;</span>
        <span className="text-sm font-semibold text-maroon-700">{entry.reference}</span>
      </div>

      <h3 className="font-display text-xl font-semibold text-maroon-900 sm:text-2xl">{entry.title}</h3>

      <figure className="my-5">
        <img
          src={entry.image.src}
          alt={entry.image.alt}
          loading="lazy"
          className="mx-auto max-h-[420px] w-auto rounded-sm border border-maroon-800/20 bg-parchment-100 object-contain shadow-md"
        />
        <figcaption className="mt-2 text-center text-xs italic text-maroon-700/70">{entry.image.credit}</figcaption>
      </figure>

      <blockquote className="border-l-4 border-maroon-700 bg-maroon-700/5 py-2 pl-4 pr-2 font-serif text-[1.05rem] italic leading-relaxed text-maroon-900/90 sm:text-lg">
        &ldquo;{entry.excerpt}&rdquo;
      </blockquote>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-maroon-900/80">{entry.summary}</p>
    </article>
  );
}
