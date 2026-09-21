import BibleLayout from "../../components/bible/BibleLayout";
import { lukeLineage, matthewLineage } from "../../data/bible/lineage";
import type { Lineage as LineageData } from "../../data/bible/types";

function LineageChain({ lineage }: { lineage: LineageData }) {
  return (
    <div className="rounded-sm border border-maroon-700/25 bg-parchment-50/90 p-5 shadow-[0_2px_10px_rgba(74,14,14,0.08)] sm:p-7">
      <h2 className="font-display text-xl font-semibold text-maroon-900 sm:text-2xl">{lineage.title}</h2>
      <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-maroon-700">{lineage.reference}</p>

      <ol className="mt-6">
        {lineage.generations.map((person, i) => (
          <li key={`${person.name}-${i}`} className="relative pl-8">
            {i !== lineage.generations.length - 1 && (
              <span className="absolute left-[7px] top-4 h-full w-0.5 bg-maroon-700/30" aria-hidden="true" />
            )}
            <span className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-maroon-700 bg-parchment-50" />
            <div className="pb-5">
              <p className="font-serif text-base font-semibold text-maroon-900">{person.name}</p>
              {person.note ? <p className="mt-0.5 text-sm italic text-maroon-800/75">{person.note}</p> : null}
            </div>
            {i !== lineage.generations.length - 1 && (
              <span
                className="absolute left-[2px] top-6 text-maroon-700/60"
                style={{ fontSize: "0.7rem" }}
                aria-hidden="true"
              >
                &#9660;
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function LineagePage() {
  return (
    <BibleLayout
      title="The Lineage of Jesus"
      subtitle="The New Testament records two genealogies of Jesus Christ — Matthew's and Luke's — which agree from Abraham to David but diverge afterward. Both are given here in full, in the words of the King James Version."
    >
      <div className="mb-8 rounded-sm border border-maroon-700/25 bg-maroon-700/5 p-5 text-sm leading-relaxed text-maroon-900/85 sm:p-6">
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-maroon-700">
          Why do the two genealogies differ?
        </p>
        <p>{matthewLineage.explanation}</p>
        <p className="mt-3">{lukeLineage.explanation}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <LineageChain lineage={matthewLineage} />
        <LineageChain lineage={lukeLineage} />
      </div>
    </BibleLayout>
  );
}
