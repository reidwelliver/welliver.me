import { Board } from "./components/Board";
import "./App.css";
import { ScaleProvider } from "./context/Scale";

function App() {
  return (
    <div className="app">
      <ScaleProvider>
        <Board />
      </ScaleProvider>
    </div>
  );
}

export default App;
