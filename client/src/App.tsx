import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Success from "./pages/Success";
import Policies from "./pages/Policies";
import PaymentDebug from "./pages/PaymentDebug";
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
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<Success />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/debug" element={<PaymentDebug />} />
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