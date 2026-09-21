import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const CARDS: { to: string; title: string; description: string }[] = [
  {
    to: "/old-testament",
    title: "Old Testament",
    description:
      "A chronological journey from the Creation through the return from exile, illustrated with Gustave Doré's celebrated 1866 engravings.",
  },
  {
    to: "/new-testament",
    title: "New Testament",
    description:
      "From the Annunciation to the vision of the New Jerusalem — the life of Jesus, the birth of the Church, and the Book of Revelation.",
  },
  {
    to: "/people",
    title: "Key People",
    description:
      "Portraits of the patriarchs, prophets, kings, and apostles whose stories carry the biblical narrative from Eden to the early Church.",
  },
  {
    to: "/lineage",
    title: "Lineage of Jesus",
    description:
      "The two New Testament genealogies of Jesus Christ, Matthew's and Luke's, given in full in the words of the King James Version.",
  },
];

export default function Home() {
  return (
    <Layout>
      <div className="text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.35em] text-maroon-600">Welcome to</p>
        <h1 className="font-display text-4xl font-semibold tracking-wide text-maroon-800 sm:text-5xl md:text-6xl">
          The Bible Timeline
        </h1>
        <div className="mx-auto mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-maroon-700/50" />
          <span className="text-maroon-600">&#10022;</span>
          <span className="h-px w-16 bg-maroon-700/50" />
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-base italic leading-relaxed text-maroon-800/80 sm:text-lg">
          A chronological journey through the King James Version, from Creation to Revelation, illustrated
          with Gustave Doré's celebrated 1866 Bible engravings. Explore the sweep of biblical history, meet
          its key people, and trace the lineage of Jesus Christ.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group flex flex-col rounded-sm border border-maroon-700/25 bg-parchment-50/90 p-6 shadow-[0_2px_10px_rgba(74,14,14,0.08)] transition-colors hover:bg-maroon-700/5 sm:p-7"
          >
            <h2 className="font-display text-xl font-semibold text-maroon-900 group-hover:text-maroon-700 sm:text-2xl">
              {card.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-maroon-900/80">{card.description}</p>
            <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-maroon-700">
              Explore &rarr;
            </span>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
