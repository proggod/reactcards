import React, { useState, useEffect } from 'react';

const CardStacker = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);

  // Card data
  const cards = [
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
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setDocumentHeight(document.body.scrollHeight);
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Create extra space for scrolling
    document.body.style.height = "500vh";
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate animation progress (0 to 1)
  const scrollPercentage = documentHeight ? scrollPosition / (documentHeight - viewportHeight) : 0;

  // Determine which cards are visible based on scroll position
  const getCardVisibility = (index) => {
    const thresholds = [0.1, 0.2, 0.3]; // When each card appears
    return scrollPercentage > thresholds[index];
  };

  // Determine the position and stack arrangement of each card
  const getCardStyle = (index) => {
    const isVisible = getCardVisibility(index);
    
    // Base styles
    const baseStyle = {
      position: 'absolute',
      width: '100%',
      maxWidth: '32rem',
      transition: 'all 0.5s ease-out',
      zIndex: index + 1, // Higher index = higher z-index, so newer cards appear on top
      opacity: isVisible ? 1 : 0,
      transform: isVisible 
        ? `translateY(${(cards.length - 1 - index) * 20}px)` // Invert offset (last card has 0 offset)
        : 'translateY(100vh)', // Start from bottom of screen
    };
    
    // When all cards are visible and we scroll further, compress the stack
    if (scrollPercentage > 0.4) {
      const compressionFactor = Math.min((scrollPercentage - 0.4) / 0.2, 1);
      baseStyle.transform = `translateY(${(cards.length - 1 - index) * 20 * (1 - compressionFactor)}px)`;
    }
    
    return baseStyle;
  };

  // Custom icon component based on the title
  const TitleIcon = ({ title }) => {
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
    } else {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
        </svg>
      );
    }
  };

  // Determine if the "Read more" button should be visible
  const showReadMore = scrollPercentage > 0.45;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Initial instruction area */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Scroll Down</h1>
          <p className="text-lg mb-8">Watch the cards appear and stack on top of each other</p>
          <div className="animate-bounce">
            <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Cards container - fixed to allow stacking in place */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
        {cards.map((card, index) => (
          <div 
            key={card.id}
            className="bg-white rounded-xl p-6 shadow-md mx-auto"
            style={getCardStyle(index)}
          >
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <TitleIcon title={card.title} />
              </div>
              <h2 className="text-xl font-medium text-gray-800">{card.title}</h2>
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
        ))}

        {/* Read more button */}
        <div 
          className={`absolute bottom-0 w-full flex justify-center transition-opacity duration-700 mt-12 ${
            showReadMore ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            transform: 'translateY(180px)',
            transitionDelay: '0.3s'
          }}
        >
          <button className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
            Read more in the docs →
          </button>
        </div>
      </div>

      {/* Extra content after cards to enable scrolling */}
      <div className="h-screen mt-screen pt-screen"></div>
    </div>
  );
};

export default CardStacker;
