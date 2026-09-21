import BibleLayout from "../../components/bible/BibleLayout";
import EraTimeline from "../../components/bible/EraTimeline";
import { oldTestamentTimeline } from "../../data/bible/oldTestamentTimeline";

export default function OldTestament() {
  return (
    <BibleLayout
      title="The Old Testament"
      subtitle="A chronological journey from the Creation through the return from exile, illustrated with Gustave Doré's celebrated 1866 Bible engravings and told in the words of the King James Version."
    >
      <EraTimeline entries={oldTestamentTimeline} />
    </BibleLayout>
  );
}
