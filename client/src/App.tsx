import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Success from "./pages/Success";

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
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-600">
              <a 
                href="https://merchant.razorpay.com/policy/Qs4WdtHGxKVMex/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Terms and Conditions
              </a>
              <a 
                href="https://merchant.razorpay.com/policy/Qs4WdtHGxKVMex/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="https://merchant.razorpay.com/policy/Qs4WdtHGxKVMex/refund" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Cancellations and Refunds
              </a>
              <a 
                href="https://merchant.razorpay.com/policy/Qs4WdtHGxKVMex/shipping" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Shipping Policy
              </a>
            </div>
            <div className="text-center text-xs text-gray-500 mt-4">
              © 2024 Event Hosting. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;