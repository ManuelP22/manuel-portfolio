import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomeFullpage from "./pages/HomeFullpage";
import Resume from "./pages/Resume";

export default function App() {
  return (
    // el root NO scrollea
    <div className="h-[100svh] flex flex-col overflow-hidden bg-base text-accent">
      <Header />
      {/* esta zona sí puede scrollear según la ruta */}
      <div className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<HomeFullpage />} />
          {/* Resume con scroll propio */}
          <Route path="/resume" element={
            <div className="h-full overflow-y-auto">
              <Resume />
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}
