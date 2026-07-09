import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import IssueTablet from "./pages/IssueTablet";
import ReturnTablet from "./pages/ReturnTablet";
import History from "./pages/History";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/issue"
          element={<IssueTablet />}
        />

        <Route
          path="/return"
          element={<ReturnTablet />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;