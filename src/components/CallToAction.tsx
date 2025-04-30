import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <div className="bg-indigo-700 text-white py-16">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-indigo-100 mb-8 text-lg">
          Join thousands of developers who are building amazing interfaces with our components.
        </p>
        <button className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
