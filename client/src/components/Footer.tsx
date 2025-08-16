import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-4">Legal & Privacy</h3>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <a href="/policies#privacy-policy" className="text-sm text-slate-300 hover:text-white transition-colors underline">
              Privacy Policy
            </a>
            <a href="/policies#terms-of-service" className="text-sm text-slate-300 hover:text-white transition-colors underline">
              Terms and Conditions
            </a>
            <a href="/policies#refund-policy" className="text-sm text-slate-300 hover:text-white transition-colors underline">
              Refund and Cancellation Policy
            </a>
          </div>
          <div className="border-t border-slate-600 pt-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              © 2025 LG 87 Play Arena & Flying Skaters Academy. All rights reserved. 
              This event is organized in compliance with local sports regulations and safety standards.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;