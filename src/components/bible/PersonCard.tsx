import type { BiblePerson } from "../../data/bible/types";

export default function PersonCard({ person }: { person: BiblePerson }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-maroon-700/25 bg-parchment-50/90 shadow-[0_2px_10px_rgba(74,14,14,0.08)]">
      <div className="bg-parchment-100">
        <img
          src={person.image.src}
          alt={person.image.alt}
          loading="lazy"
          className="mx-auto h-56 w-full object-cover object-top"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-center text-[0.7rem] italic text-maroon-700/60">{person.image.credit}</p>

        <h3 className="mt-2 text-center font-display text-lg font-semibold text-maroon-900">{person.name}</h3>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-center">
          <span className="rounded-full border border-maroon-700/40 bg-maroon-700/10 px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-maroon-800">
            {person.role}
          </span>
          <span className="rounded-full border border-maroon-700/40 bg-maroon-700/10 px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-maroon-800">
            {person.testament} Testament
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-maroon-900/80">{person.summary}</p>

        <p className="mt-4 border-t border-maroon-700/20 pt-2 text-xs font-semibold uppercase tracking-wide text-maroon-700">
          {person.keyReference}
        </p>
      </div>
    </article>
  );
}
