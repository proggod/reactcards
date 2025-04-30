import React, { useState, useEffect } from 'react';

interface FeaturesSectionProps {
  featureSectionRef: React.RefObject<HTMLDivElement | null>;
  cardPositions: Record<number, { x: number; y: number }>;
  dragState: {
    isDragging: boolean;
    cardId: number | null;
    cardType?: 'stack' | 'tech' | 'feature' | null;
  };
  handleMouseDown: (e: React.MouseEvent, cardId: number, cardType: 'stack' | 'tech' | 'feature', cardIndex?: number) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  featureSectionRef,
  cardPositions,
  dragState,
  handleMouseDown
}) => {
  const [featureCardsVisible, setFeatureCardsVisible] = useState<boolean[]>([false, false, false]);

  // Set up Intersection Observer for animated cards
  useEffect(() => {
    // Initially hide all cards
    setFeatureCardsVisible([false, false, false]);

    // Create observer for the feature cards section
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.2, // Trigger when 20% of the element is visible
    };

    // Observer for feature cards
    const featureObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Stagger the appearance of each card
        setTimeout(() => setFeatureCardsVisible([true, false, false]), 0);
        setTimeout(() => setFeatureCardsVisible([true, true, false]), 300);
        setTimeout(() => setFeatureCardsVisible([true, true, true]), 600);

        // Unobserve after animation is triggered
        if (featureSectionRef.current) {
          featureObserver.unobserve(featureSectionRef.current);
        }
      }
    }, observerOptions);

    // Store ref in variable to use in cleanup
    const featureSection = featureSectionRef.current;

    // Start observing
    if (featureSection) {
      featureObserver.observe(featureSection);
    }

    // Clean up
    return () => {
      if (featureSection) featureObserver.unobserve(featureSection);
    };
  }, [featureSectionRef]);

  return (
    <div className="max-w-6xl mx-auto py-16 px-4" ref={featureSectionRef}>
      <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div
          className={`card bg-white p-6 rounded-xl shadow-md transition-all duration-700 transform ${
            featureCardsVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
          style={{
            ...cardPositions[2000] && {
              transform: `translate(${cardPositions[2000].x}px, ${cardPositions[2000].y}px)`,
              position: 'relative',
              zIndex: dragState.cardId === 2000 ? 999 : 1,
              transition: dragState.isDragging && dragState.cardId === 2000 ? 'none' : 'all 0.7s ease-out'
            }
          }}
          onMouseDown={(e) => handleMouseDown(e, 2000, 'feature', 0)}
        >
          <div className="card-header flex items-center mb-4" style={{ cursor: 'grab', position: 'relative' }}>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>

            {/* Drag handle indicator */}
            <div className="ml-auto flex items-center text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 5h8M8 12h8M8 19h8" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600">
            Optimized for performance with minimal overhead and maximum efficiency.
          </p>
        </div>

        {/* Feature 2 */}
        <div
          className={`card bg-white p-6 rounded-xl shadow-md transition-all duration-700 transform ${
            featureCardsVisible[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
          style={{
            transitionDelay: '0.2s',
            ...cardPositions[2001] && {
              transform: `translate(${cardPositions[2001].x}px, ${cardPositions[2001].y}px)`,
              position: 'relative',
              zIndex: dragState.cardId === 2001 ? 999 : 1,
              transition: dragState.isDragging && dragState.cardId === 2001 ? 'none' : 'all 0.7s ease-out'
            }
          }}
          onMouseDown={(e) => handleMouseDown(e, 2001, 'feature', 1)}
        >
          <div className="card-header flex items-center mb-4" style={{ cursor: 'grab', position: 'relative' }}>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Secure by Default</h3>

            {/* Drag handle indicator */}
            <div className="ml-auto flex items-center text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 5h8M8 12h8M8 19h8" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600">
            Built with security in mind at every step of the development process.
          </p>
        </div>

        {/* Feature 3 */}
        <div
          className={`card bg-white p-6 rounded-xl shadow-md transition-all duration-700 transform ${
            featureCardsVisible[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
          style={{
            transitionDelay: '0.4s',
            ...cardPositions[2002] && {
              transform: `translate(${cardPositions[2002].x}px, ${cardPositions[2002].y}px)`,
              position: 'relative',
              zIndex: dragState.cardId === 2002 ? 999 : 1,
              transition: dragState.isDragging && dragState.cardId === 2002 ? 'none' : 'all 0.7s ease-out'
            }
          }}
          onMouseDown={(e) => handleMouseDown(e, 2002, 'feature', 2)}
        >
          <div className="card-header flex items-center mb-4" style={{ cursor: 'grab', position: 'relative' }}>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Modular Design</h3>

            {/* Drag handle indicator */}
            <div className="ml-auto flex items-center text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 5h8M8 12h8M8 19h8" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600">
            Flexible architecture that allows you to use only what you need.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
