import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Success from "./pages/Success";
import ApiTest from "./pages/ApiTest";
import Navigation from "./components/Navigation";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/api-test" element={<ApiTest />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;