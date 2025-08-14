import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Success from "./pages/Success";
import ConnectionTest from "./components/ConnectionTest";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Connection status header */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <ConnectionTest />
          </div>
        </div>
        
        {/* Main content */}
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;