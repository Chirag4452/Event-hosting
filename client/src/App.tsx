import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Success from "./pages/Success";
import AboutOrganizers from "./components/AboutOrganizers";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <AboutOrganizers />
        <Contact />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;