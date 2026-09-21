import BibleLayout from "../../components/bible/BibleLayout";
import EraTimeline from "../../components/bible/EraTimeline";
import { newTestamentTimeline } from "../../data/bible/newTestamentTimeline";

export default function NewTestament() {
  return (
    <BibleLayout
      title="The New Testament"
      subtitle="From the Annunciation to the vision of the New Jerusalem — the life of Jesus, the birth of the Church, and the Book of Revelation, illustrated with Gustave Doré's 1866 Bible engravings in the words of the King James Version."
    >
      <EraTimeline entries={newTestamentTimeline} />
    </BibleLayout>
  );
}
