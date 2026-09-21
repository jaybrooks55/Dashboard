import { useMemo, useState } from "react";
import BibleLayout from "../../components/bible/BibleLayout";
import PersonCard from "../../components/bible/PersonCard";
import { keyPeople } from "../../data/bible/keyPeople";

type Filter = "All" | "Old" | "New";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Old", label: "Old Testament" },
  { value: "New", label: "New Testament" },
];

export default function KeyPeople() {
  const [filter, setFilter] = useState<Filter>("All");

  const people = useMemo(
    () => (filter === "All" ? keyPeople : keyPeople.filter((p) => p.testament === filter)),
    [filter],
  );

  return (
    <BibleLayout
      title="Key People of the Bible"
      subtitle="Portraits of the patriarchs, prophets, kings, and apostles whose stories carry the biblical narrative from Eden to the early Church."
    >
      <div className="mb-8 flex justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-1.5 font-display text-sm tracking-wide transition-colors ${
              filter === f.value
                ? "border-maroon-700 bg-maroon-700 text-parchment-50"
                : "border-maroon-700/40 bg-parchment-50/70 text-maroon-800 hover:bg-maroon-700/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </BibleLayout>
  );
}
