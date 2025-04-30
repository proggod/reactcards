import React, { useRef, useState, useEffect } from 'react';
import TitleIcon from './TitleIcon';

interface CardItem {
  icon: React.ReactNode;
  label: string;
}

interface Card {
  id: number;
  title: string;
  items: CardItem[];
}

interface CardPosition {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  cardId: number | null;
  initialX: number;
  initialY: number;
  offsetX: number;
  offsetY: number;
}

interface StackedCardsProps {
  techSectionRef: React.RefObject<HTMLDivElement | null>;
}

const StackedCards: React.FC<StackedCardsProps> = ({ techSectionRef }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [pastView, setPastView] = useState(false);
  const [cardPositions, setCardPositions] = useState<Record<number, CardPosition>>({});
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    cardId: null,
    initialX: 0,
    initialY: 0,
    offsetX: 0,
    offsetY: 0
  });

  // Sample cards data
  const cards: Card[] = [
    {
      id: 1,
      title: "Any models",
      items: [
        { icon: "🤖", label: "GPT-4" },
        { icon: "🧠", label: "Claude" },
        { icon: "🔍", label: "Gemini" }
      ]
    },
    {
      id: 2,
      title: "Any context",
      items: [
        { icon: "📄", label: "Files" },
        { icon: "💬", label: "Chat" },
        { icon: "🌐", label: "Web" }
      ]
    },
    {
      id: 3,
      title: "Any blocks",
      items: [
        { icon: "📊", label: "Charts" },
        { icon: "📝", label: "Text" },
        { icon: "🖼️", label: "Images" }
      ]
    },
    {
      id: 4,
      title: "Any integrations",
      items: [
        { icon: "🔄", label: "GitHub" },
        { icon: "📋", label: "Jira" },
        { icon: "📱", label: "Slack" }
      ]
    },
    {
      id: 5,
      title: "Any workflows",
      items: [
        { icon: "🔄", label: "CI/CD" },
        { icon: "🧪", label: "Testing" },
        { icon: "🚀", label: "Deploy" }
      ]
    }
  ];

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent, cardId: number) => {
    e.preventDefault();
    const uniqueId = cardId;

    setDragState({
      isDragging: true,
      cardId: uniqueId,
      initialX: e.clientX,
      initialY: e.clientY,
      offsetX: cardPositions[uniqueId]?.x || 0,
      offsetY: cardPositions[uniqueId]?.y || 0
    });
  };

  // Add global mouse event listeners for drag
  useEffect(() => {
    // Define the handlers inside the effect to avoid dependency issues
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging) return;

      const deltaX = e.clientX - dragState.initialX;
      const deltaY = e.clientY - dragState.initialY;

      // Update card position
      setCardPositions(prev => ({
        ...prev,
        [dragState.cardId!]: {
          x: dragState.offsetX + deltaX,
          y: dragState.offsetY + deltaY
        }
      }));
    };

    const onMouseUp = () => {
      if (dragState.isDragging) {
        setDragState(prev => ({
          ...prev,
          isDragging: false
        }));
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragState]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);

      if (sectionRef.current) {
        const sectionBottom = sectionRef.current.getBoundingClientRect().bottom;
        const sectionTop = sectionRef.current.getBoundingClientRect().top;

        // Section is past view when its bottom is at or above the viewport top
        setPastView(sectionBottom <= 0);

        // Ensure cards are hidden when section is not in view
        if (sectionTop > window.innerHeight) {
          // Section is below viewport, ensure cards are hidden
          setScrollY(0); // Reset scroll position to hide cards
        }

        // Also hide cards when tech section is at the top
        if (techSectionRef.current && techSectionRef.current.getBoundingClientRect().top <= 0) {
          // Force cards to be hidden
          setScrollY(0);
          setPastView(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [techSectionRef]);

  // Calculate the progress of scrolling through the section (0 to 1)
  const getScrollProgress = () => {
    if (!sectionRef.current) return 0;

    const sectionHeight = sectionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollPosition = scrollY;
    const sectionTop = sectionRef.current.offsetTop;

    // If the section is below the "Interactive Card Technology" section, return 0
    if (techSectionRef.current) {
      const techSectionRect = techSectionRef.current.getBoundingClientRect();
      if (techSectionRect.top <= 0) {
        return 0; // Force cards to be hidden when tech section is at the top
      }
    }

    // Calculate how far we've scrolled into the section
    const scrollIntoSection = scrollPosition - sectionTop + viewportHeight;

    // Calculate progress (0 when just entering, 1 when about to exit)
    return Math.max(0, Math.min(1, scrollIntoSection / (sectionHeight + viewportHeight)));
  };

  return (
    <div ref={sectionRef} className="min-h-screen relative bg-gray-100">
      {/* Staggered red text above the cards - centered overall */}
      <div className="pt-16 pb-8 max-w-3xl mx-auto">
        <div className="flex flex-col">
          <p className="text-xl md:text-2xl mb-4 text-red-500 font-bold uppercase"
             style={{ marginLeft: '15%', textAlign: 'left' }}>
            No more high API fees
          </p>
          <p className="text-xl md:text-2xl mb-4 text-red-500 font-bold uppercase"
             style={{ marginLeft: '25%', textAlign: 'left' }}>
            No nerfed results
          </p>
          <p className="text-xl md:text-2xl mb-4 text-red-500 font-bold uppercase"
             style={{ marginLeft: '35%', textAlign: 'left' }}>
            No limited AI models
          </p>
        </div>
      </div>

      {/* Cards container */}
      <div
        ref={cardsRef}
        className="w-full max-w-lg mx-auto relative"
        style={{
          height: '600px', // Increased from 400px to accommodate more cards
          position: pastView ? 'relative' : 'sticky',
          top: '20vh', // Position more towards the top of the page
          marginTop: '50px',
          display: techSectionRef.current && techSectionRef.current.getBoundingClientRect().top <= 0 ? 'none' : 'block' // Hide completely when tech section is at top
        }}
      >
        {/* Cards */}
        {cards.map((card, index) => {
          // Calculate styles based on scroll position
          const progress = getScrollProgress();

          // Determine when each card should appear (staggered)
          const appearThreshold = index * 0.1; // Reduced from 0.15 to space out the cards better with more cards
          const isVisible = progress > appearThreshold;

          // Calculate the vertical stacking offset (how much each card is offset from the previous one)
          const verticalOffset = 60; // Pixels between cards vertically
          const yOffset = index * verticalOffset; // First card (index 0) has no offset, each subsequent card is offset more

          // Add horizontal offset for skewed effect
          const horizontalOffset = 15; // Pixels to offset each card horizontally
          const xOffset = index * horizontalOffset; // Each card moves right by this amount

          // Compress the stack as we approach the end of the section
          const compressionStart = 0.7;
          const finalYOffset = progress > compressionStart
            ? yOffset * (1 - ((progress - compressionStart) / (1 - compressionStart)))
            : yOffset;

          const finalXOffset = progress > compressionStart
            ? xOffset * (1 - ((progress - compressionStart) / (1 - compressionStart)))
            : xOffset;

          // Get custom position for this card if it exists
          const customPosition = cardPositions[card.id] || { x: 0, y: 0 };

          // Card styles
          const cardStyle: React.CSSProperties = pastView
            ? {
                position: 'relative',
                opacity: 1,
                transform: 'none',
                marginBottom: '1.5rem',
                transition: dragState.isDragging && dragState.cardId === card.id ? 'none' : 'all 0.5s ease-out',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                cursor: 'grab',
              }
            : {
                position: 'absolute',
                width: '100%',
                transition: dragState.isDragging && dragState.cardId === card.id ? 'none' : 'all 0.5s ease-out',
                opacity: isVisible ? 1 : 0,
                visibility: isVisible ? 'visible' : 'hidden', // Add visibility property to prevent flash
                transform: isVisible
                  ? dragState.isDragging && dragState.cardId === card.id
                    ? `translate(${customPosition.x}px, ${customPosition.y}px)`
                    : `translate(${finalXOffset + customPosition.x}px, ${finalYOffset + customPosition.y}px)`
                  : 'translateY(100vh)',
                zIndex: dragState.cardId === card.id ? 999 : index + 1, // Dragged card gets highest z-index
                boxShadow: dragState.cardId === card.id
                  ? '0 8px 24px rgba(0, 0, 0, 0.2)' // Enhanced shadow when dragging
                  : '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                cursor: 'grab',
              };

          return (
            <div
              key={card.id}
              className="card bg-white rounded-xl p-6 mx-auto"
              style={cardStyle}
              onMouseDown={(e) => handleMouseDown(e, card.id)}
            >
              <div className="flex items-center mb-6 card-header" style={{ cursor: 'grab', position: 'relative' }}>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <TitleIcon title={card.title} />
                </div>
                <h2 className="text-xl font-medium text-gray-800">{card.title}</h2>

                {/* Drag handle indicator */}
                <div className="ml-auto flex items-center text-gray-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 5h8M8 12h8M8 19h8" />
                  </svg>
                </div>

                {/* Tooltip that appears on hover */}
                <div className="absolute top-0 right-0 mt-8 mr-2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Drag from here
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {card.items.map((item, i) => (
                  <div key={i} className="bg-gray-100 px-3 py-2 rounded-lg flex items-center text-sm text-gray-700">
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StackedCards;
