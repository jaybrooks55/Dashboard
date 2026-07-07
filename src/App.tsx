import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import DailyBriefing from "./pages/DailyBriefing";
import Todos from "./pages/Todos";
import Calendar from "./pages/Calendar";
import Journal from "./pages/Journal";
import StubPage from "./pages/StubPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/set-password" element={<SetPassword />} />

        <Route element={<Layout />}>
          <Route path="/" element={<DailyBriefing />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/journal" element={<Journal />} />
          <Route
            path="/habits"
            element={
              <StubPage
                title="Habit Tracker"
                description="Visual weekly progress bars per habit. Schema is live (habits + habit_logs); UI ships next."
              />
            }
          />
          <Route
            path="/notes"
            element={
              <StubPage
                title="Notes"
                description="Idea and quick-notes capture. Quick Capture already saves here — a browsable list/editor view is next."
              />
            }
          />
          <Route
            path="/reading"
            element={
              <StubPage
                title="Reading"
                description="Book tracker: want to read / reading / finished, with ratings and notes."
              />
            }
          />
          <Route
            path="/exercise"
            element={<StubPage title="Exercise Log" description="Log workouts: activity, duration, notes." />}
          />
          <Route
            path="/meals"
            element={<StubPage title="Meal Planning" description="Plan breakfast/lunch/dinner/snacks by day." />}
          />
          <Route
            path="/focus"
            element={
              <StubPage
                title="Focus Timer"
                description="Body-doubling / focus timer sessions, logged to focus_sessions."
              />
            }
          />
          <Route
            path="/reminders"
            element={
              <StubPage
                title="Reminders"
                description="Recurring reminders and auto-logged commitments pulled from journal/notes."
              />
            }
          />
          <Route
            path="/weekly-review"
            element={<StubPage title="Weekly Review" description="A guided weekly review prompt." />}
          />
          <Route
            path="/recap"
            element={
              <StubPage
                title="Daily Recap"
                description="End-of-day 2-minute recap: what got done, what's carrying over."
              />
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
