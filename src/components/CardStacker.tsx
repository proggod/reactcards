import { useState, useEffect, useRef } from 'react';

// Define types for our data
interface CardItem {
  icon: string;
  label: string;
}

interface Card {
  id: number;
  title: string;
  items: CardItem[];
}

interface TitleIconProps {
  title: string;
}

interface DragState {
  isDragging: boolean;
  cardId: number | null;
  cardType: 'stack' | 'tech' | 'feature' | null;
  cardIndex?: number;
  initialX: number;
  initialY: number;
  offsetX: number;
  offsetY: number;
}

const CardStacker = () => {
  const [scrollY, setScrollY] = useState(0);
  const [pastView, setPastView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // State for drag functionality
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    cardId: null,
    cardType: null,
    initialX: 0,
    initialY: 0,
    offsetX: 0,
    offsetY: 0
  });

  // Store custom positions for each card
  const [cardPositions, setCardPositions] = useState<Record<number, { x: number, y: number }>>({});

  // State for animated cards in the features sections
  const [techCardsVisible, setTechCardsVisible] = useState<boolean[]>([false, false, false]);
  const [featureCardsVisible, setFeatureCardsVisible] = useState<boolean[]>([false, false, false]);

  // Refs for the feature sections
  const techSectionRef = useRef<HTMLDivElement>(null);
  const featureSectionRef = useRef<HTMLDivElement>(null);

  // Card data
  const cards: Card[] = [
    {
      id: 1,
      title: "Any models",
      items: [
        { icon: "🤖", label: "Ollama" },
        { icon: "🧠", label: "OpenAI" },
        { icon: "🔮", label: "Together" },
        { icon: "⭐", label: "Anthropic" },
        { icon: "🌀", label: "Mistral" },
        { icon: "☁️", label: "Azure OpenAI Service" },
        { icon: "🖥️", label: "LM Studio" },
      ]
    },
    {
      id: 2,
      title: "Any context",
      items: [
        { icon: "📁", label: "Codebase" },
        { icon: "🐙", label: "GitLab Issues" },
        { icon: "📄", label: "Documentation" },
        { icon: "🔧", label: "Methods" },
        { icon: "📝", label: "Confluence pages" },
        { icon: "📂", label: "Files" },
      ]
    },
    {
      id: 3,
      title: "Any blocks",
      items: [
        { icon: "💾", label: "Data blocks" },
        { icon: "📚", label: "Docs blocks" },
        { icon: "⚖️", label: "Rules blocks" },
        { icon: "📊", label: "MCP blocks" },
        { icon: "💡", label: "Prompts blocks" },
      ]
    },
    {
      id: 4,
      title: "Any integrations",
      items: [
        { icon: "🔄", label: "GitHub" },
        { icon: "🔍", label: "Jira" },
        { icon: "📊", label: "Slack" },
        { icon: "📝", label: "Notion" },
        { icon: "📈", label: "Linear" },
        { icon: "🔗", label: "Figma" },
      ]
    },
    {
      id: 5,
      title: "Any workflows",
      items: [
        { icon: "🚀", label: "CI/CD Pipelines" },
        { icon: "🧪", label: "Test Automation" },
        { icon: "📦", label: "Deployment" },
        { icon: "🔧", label: "Code Review" },
        { icon: "🔍", label: "Bug Tracking" },
        { icon: "📈", label: "Performance Monitoring" },
      ]
    }
  ];

  // Handle mouse down event to start dragging
  const handleMouseDown = (e: React.MouseEvent, cardId: number, cardType: 'stack' | 'tech' | 'feature', cardIndex?: number) => {
    // Only allow dragging by the header area (first 40px from top)
    const targetElement = e.target as HTMLElement;
    const cardElement = targetElement.closest('.card') as HTMLElement;

    if (!cardElement) return;

    const cardRect = cardElement.getBoundingClientRect();
    const clickY = e.clientY - cardRect.top;

    // Only allow dragging from the top portion of the card (header area)
    if (clickY > 40) return;

    // Prevent default behavior and text selection
    e.preventDefault();

    // Create a unique ID for tech and feature cards
    const uniqueId = cardType === 'stack' ? cardId :
                     cardType === 'tech' ? 1000 + (cardIndex || 0) :
                     2000 + (cardIndex || 0);

    // Set initial drag state
    setDragState({
      isDragging: true,
      cardId: uniqueId,
      cardType: cardType,
      cardIndex: cardIndex,
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

  // Set up Intersection Observer for animated cards
  useEffect(() => {
    // Initially hide all cards until scrolling begins
    setTechCardsVisible([false, false, false]);
    setFeatureCardsVisible([false, false, false]);

    // Create observers for the tech cards and feature cards sections
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

    // Store refs in variables to use in cleanup
    const techSection = techSectionRef.current;
    const featureSection = featureSectionRef.current;

    // Start observing
    if (techSection) {
      techObserver.observe(techSection);
    }

    if (featureSection) {
      featureObserver.observe(featureSection);
    }

    // Clean up
    return () => {
      if (techSection) techObserver.unobserve(techSection);
      if (featureSection) featureObserver.unobserve(featureSection);
    };
  }, []);

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
  }, []);

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



  // Custom icon component based on the title
  const TitleIcon = ({ title }: TitleIconProps) => {
    if (title === "Any models") {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );
    } else if (title === "Any context") {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      );
    } else if (title === "Any blocks") {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
        </svg>
      );
    } else if (title === "Any integrations") {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22v-5M9 8V3m6 5V3M5 12H2m20 0h-3M7.05 19.07l-2.12 2.12M19.07 7.05l-2.12 2.12m0 9.9l2.12 2.12M7.05 5.05l-2.12-2.12" />
        </svg>
      );
    } else if (title === "Any workflows") {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
          <path d="M16 12l-4 4-4-4m4 4V8" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header similar to c3.ai */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-8">CardStacker</div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-indigo-200 transition-colors">Features</a>
              <a href="#" className="hover:text-indigo-200 transition-colors">Examples</a>
              <a href="#" className="hover:text-indigo-200 transition-colors">Documentation</a>
              <a href="#" className="hover:text-indigo-200 transition-colors">About</a>
            </nav>
          </div>
          <div>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero section with main heading */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-2">
            Intuitive. <span className="text-indigo-400">Powerful.</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-medium mb-6 text-gray-300">with visual studio code</h2>
          <p className="text-xl md:text-2xl mb-4 text-gray-300">
            AI-Powered Code Assistance: Efficient, Affordable, Effective
          </p>
          <p className="text-md md:text-lg mb-12 text-gray-400 max-w-3xl mx-auto">
          Leverage multi-edits and smarter model utilization to provide full context like results—at a fraction of the cost.
          </p>
          <div className="animate-bounce">
            <svg className="w-8 h-8 mx-auto text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Cards stacking section */}
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
                onMouseDown={(e) => handleMouseDown(e, card.id, 'stack')}
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

      {/* Additional content section with enterprise-style layout */}
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
              onMouseDown={(e) => handleMouseDown(e, 0, 'tech', 0)}
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
              onMouseDown={(e) => handleMouseDown(e, 0, 'tech', 1)}
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
              onMouseDown={(e) => handleMouseDown(e, 0, 'tech', 2)}
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

      {/* Feature section with grid */}
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
            onMouseDown={(e) => handleMouseDown(e, 0, 'feature', 0)}
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
            onMouseDown={(e) => handleMouseDown(e, 0, 'feature', 1)}
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
            onMouseDown={(e) => handleMouseDown(e, 0, 'feature', 2)}
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

      {/* Testimonials section */}
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

      {/* Call to action section */}
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

      {/* Footer with enterprise style */}
      <footer className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-12">
            <div className="mb-8 md:mb-0">
              <div className="text-3xl font-bold mb-4">CardStacker</div>
              <p className="text-indigo-200 max-w-xs">
                The enterprise solution for interactive information presentation
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Releases</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Press</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Partners</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Status</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Twitter</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">GitHub</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Discord</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-indigo-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-200 mb-4 md:mb-0">© 2025 CardStacker Enterprise. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CardStacker;
