import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import OldTestament from "./pages/OldTestament";
import NewTestament from "./pages/NewTestament";
import KeyPeople from "./pages/KeyPeople";
import Lineage from "./pages/Lineage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/old-testament" element={<OldTestament />} />
      <Route path="/new-testament" element={<NewTestament />} />
      <Route path="/people" element={<KeyPeople />} />
      <Route path="/lineage" element={<Lineage />} />
    </Routes>
  );
}
