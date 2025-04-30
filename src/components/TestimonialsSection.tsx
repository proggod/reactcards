import React from 'react';

const TestimonialsSection: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Sarah Johnson</h4>
                <p className="text-gray-600 text-sm">Product Manager</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "This solution has transformed how our team works. The stacking cards interface
              makes it so easy to navigate through complex information."
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Michael Chen</h4>
                <p className="text-gray-600 text-sm">Lead Developer</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "The attention to detail in the animations and transitions makes this component
              not just functional but a joy to use. Our users love it!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
