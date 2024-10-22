import React, { useState } from 'react';

function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(null); // State to track active feature
  const features = [
    { title: "AI-Powered", description: "Leverage AI to generate stunning banners and videos." },
    { title: "Customizable", description: "Easily customize templates to match your brand." },
    { title: "Fast & Efficient", description: "Generate high-quality visuals in seconds." },
  ];

  return (
    <section className="features bg-gradient-to-b from-black to-orange-600 py-16 relative">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Features</h2>
        <div className="flex justify-around flex-wrap">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card p-6 bg-white rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setActiveFeature(feature)}
            >
              <h3 className="text-2xl font-semibold text-orange-600">{feature.title}</h3>
              <p className="mt-4 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Description Popup */}
        {activeFeature && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setActiveFeature(null)} // Close the popup on click
          >
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-3xl font-semibold text-orange-600 mb-4">{activeFeature.title}</h3>
              <p className="text-lg text-gray-700">{activeFeature.description}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturesSection;
