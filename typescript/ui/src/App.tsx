import { BrowserRouter, Routes, Route } from "react-router";
import { Board } from "./components/Board";
import { MobileHome } from "./components/MobileHome";
import { MobileArticle } from "./components/MobileArticle";
import { ScaleProvider } from "./context/Scale";
import { useIsMobile } from "./hooks/useIsMobile";
import { BG_STYLE } from "./config/background";
import "./App.css";

function DesktopRoutes() {
  return (
    <ScaleProvider>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/:slug" element={<Board />} />
      </Routes>
    </ScaleProvider>
  );
}

function MobileRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MobileHome />} />
      <Route path="/:slug" element={<MobileArticle />} />
    </Routes>
  );
}

function App() {
  const isMobile = useIsMobile();

  return (
    <div className="app">
      <div className="background" style={BG_STYLE}></div>
      <BrowserRouter>
        {isMobile ? <MobileRoutes /> : <DesktopRoutes />}
      </BrowserRouter>
    </div>
  );
}

export default App;
