import { Board } from "./components/Board";
import "./App.css";
import { ScaleProvider } from "./context/Scale";
import { BG_STYLE } from "./config/background";

function App() {
  return (
    <div className="app">
      <div className="background" style={BG_STYLE}></div>
      <ScaleProvider>
        <Board />
      </ScaleProvider>
    </div>
  );
}

export default App;
