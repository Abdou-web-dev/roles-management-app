import { Route, Routes } from "react-router-dom";
import "./App.scss";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Locks from "./pages/Locks";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";
import Reports from "./pages/Locks";
import Team from "./pages/Team";
import Automations from "./pages/Automations";
import Facilities from "./pages/Facilities";
import { TopBar } from "./pages/navigation/TopBar";
import { LateralNavBar } from "./pages/navigation/LateralNavBar";

const routeConfig = [
  { path: "/", element: <Dashboard /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/locks", element: <Locks /> },
  { path: "/settings", element: <Settings /> },
  { path: "/integrations", element: <Integrations /> },
  { path: "/reports", element: <Reports /> },
  { path: "/team", element: <Team /> },
  { path: "/automations", element: <Automations /> },
  { path: "/facilities", element: <Facilities /> },
];

function App() {
  return (
    <>
      <div className="w-full app-component">
        <TopBar />

        <div className="flex w-full sidebar__with-content">
          <div className="sidebar">
            <LateralNavBar />
          </div>

          <div className="tab__content">
            <Routes>
              {routeConfig.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
              <Route
                path="*"
                element={<NotFound />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
