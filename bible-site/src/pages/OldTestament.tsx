import Layout from "../components/Layout";
import EraTimeline from "../components/EraTimeline";
import { oldTestamentTimeline } from "../data/oldTestamentTimeline";

export default function OldTestament() {
  return (
    <Layout
      title="The Old Testament"
      subtitle="A chronological journey from the Creation through the return from exile, illustrated with Gustave Doré's celebrated 1866 Bible engravings and told in the words of the King James Version."
    >
      <EraTimeline entries={oldTestamentTimeline} />
    </Layout>
  );
}
