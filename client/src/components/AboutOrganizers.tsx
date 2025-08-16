import React from 'react';

const AboutOrganizers: React.FC = () => {
  return (
    <div className="bg-slate-800 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">About the Organizers</h3>
          <div className="border-b border-slate-600 mb-6"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* LG 87 Play Arena */}
          <div className="text-center md:text-left md:pl-8">
            <h4 className="text-lg font-semibold text-blue-300 mb-3">LG 87 Play Arena</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              A premier indoor skating facility dedicated to promoting skating sports and providing 
              world-class infrastructure for competitions and training. We host various sporting events 
              throughout the year, bringing together athletes from all skill levels in a safe and 
              professional environment.
            </p>
          </div>

          {/* Flying Skaters Academy */}
          <div className="text-center md:text-right md:pr-8">
            <h4 className="text-lg font-semibold text-blue-300 mb-3">Flying Skaters Academy</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              A professional skating academy with certified coaches and comprehensive training programs. 
              We specialize in developing skating skills from beginner to advanced levels, ensuring 
              safety and proper technique for all participants while fostering a love for the sport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOrganizers;
