import React, { useState, useEffect } from 'react';

interface TechSectionProps {
  techSectionRef: React.RefObject<HTMLDivElement | null>;
  cardPositions: Record<number, { x: number; y: number }>;
  dragState: {
    isDragging: boolean;
    cardId: number | null;
    cardType?: 'stack' | 'tech' | 'feature' | null;
  };
  handleMouseDown: (e: React.MouseEvent, cardId: number, cardType: 'stack' | 'tech' | 'feature', cardIndex?: number) => void;
}

const TechSection: React.FC<TechSectionProps> = ({
  techSectionRef,
  cardPositions,
  dragState,
  handleMouseDown
}) => {
  const [techCardsVisible, setTechCardsVisible] = useState<boolean[]>([false, false, false]);

  // Set up Intersection Observer for animated cards
  useEffect(() => {
    // Initially hide all cards
    setTechCardsVisible([false, false, false]);

    // Create observer for the tech cards section
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.2, // Trigger when 20% of the element is visible
    };

    // Observer for tech cards
    const techObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Stagger the appearance of each card
        setTimeout(() => setTechCardsVisible([true, false, false]), 0);
        setTimeout(() => setTechCardsVisible([true, true, false]), 300);
        setTimeout(() => setTechCardsVisible([true, true, true]), 600);

        // Unobserve after animation is triggered
        if (techSectionRef.current) {
          techObserver.unobserve(techSectionRef.current);
        }
      }
    }, observerOptions);

    // Store ref in variable to use in cleanup
    const techSection = techSectionRef.current;

    // Start observing
    if (techSection) {
      techObserver.observe(techSection);
    }

    // Clean up
    return () => {
      if (techSection) techObserver.unobserve(techSection);
    };
  }, [techSectionRef]);

  return (
    <div className="bg-white py-24" ref={techSectionRef}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Interactive Card Technology</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our innovative card stacking system provides an intuitive and engaging way to present information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Card 1 */}
          <div
            className={`card bg-gray-50 p-8 rounded-xl shadow-md transition-all duration-700 transform ${
              techCardsVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{
              ...cardPositions[1000] && {
                transform: `translate(${cardPositions[1000].x}px, ${cardPositions[1000].y}px)`,
                position: 'relative',
                zIndex: dragState.cardId === 1000 ? 999 : 1,
                transition: dragState.isDragging && dragState.cardId === 1000 ? 'none' : 'all 0.7s ease-out'
              }
            }}
            onMouseDown={(e) => handleMouseDown(e, 1000, 'tech', 0)}
          >
            <div className="card-header flex items-center mb-6" style={{ cursor: 'grab', position: 'relative' }}>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Drag & Drop</h3>

              {/* Drag handle indicator */}
              <div className="ml-auto flex items-center text-gray-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 5h8M8 12h8M8 19h8" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600">
              Cards can be dragged and repositioned, allowing for a customizable and interactive user experience.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className={`card bg-gray-50 p-8 rounded-xl shadow-md transition-all duration-700 transform ${
              techCardsVisible[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{
              transitionDelay: '0.2s',
              ...cardPositions[1001] && {
                transform: `translate(${cardPositions[1001].x}px, ${cardPositions[1001].y}px)`,
                position: 'relative',
                zIndex: dragState.cardId === 1001 ? 999 : 1,
                transition: dragState.isDragging && dragState.cardId === 1001 ? 'none' : 'all 0.7s ease-out'
              }
            }}
            onMouseDown={(e) => handleMouseDown(e, 1001, 'tech', 1)}
          >
            <div className="card-header flex items-center mb-6" style={{ cursor: 'grab', position: 'relative' }}>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Scroll Animation</h3>

              {/* Drag handle indicator */}
              <div className="ml-auto flex items-center text-gray-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 5h8M8 12h8M8 19h8" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600">
              Cards animate and stack as you scroll, creating a visually engaging experience that guides users through content.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className={`card bg-gray-50 p-8 rounded-xl shadow-md transition-all duration-700 transform ${
              techCardsVisible[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{
              transitionDelay: '0.4s',
              ...cardPositions[1002] && {
                transform: `translate(${cardPositions[1002].x}px, ${cardPositions[1002].y}px)`,
                position: 'relative',
                zIndex: dragState.cardId === 1002 ? 999 : 1,
                transition: dragState.isDragging && dragState.cardId === 1002 ? 'none' : 'all 0.7s ease-out'
              }
            }}
            onMouseDown={(e) => handleMouseDown(e, 1002, 'tech', 2)}
          >
            <div className="card-header flex items-center mb-6" style={{ cursor: 'grab', position: 'relative' }}>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Responsive Design</h3>

              {/* Drag handle indicator */}
              <div className="ml-auto flex items-center text-gray-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 5h8M8 12h8M8 19h8" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600">
              Cards adapt to any screen size, ensuring a consistent experience across desktop and mobile devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechSection;
