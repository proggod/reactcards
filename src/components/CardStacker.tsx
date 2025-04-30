import { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import StackedCards from './StackedCards';
import TechSection from './TechSection';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import CallToAction from './CallToAction';
import Footer from './Footer';

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
  // Refs for the feature sections
  const techSectionRef = useRef<HTMLDivElement>(null);
  const featureSectionRef = useRef<HTMLDivElement>(null);

  // Store custom positions for each card
  const [cardPositions, setCardPositions] = useState<Record<number, { x: number, y: number }>>({});

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <Hero />
      <StackedCards techSectionRef={techSectionRef} />
      <TechSection 
        techSectionRef={techSectionRef} 
        cardPositions={cardPositions} 
        dragState={dragState} 
        handleMouseDown={handleMouseDown} 
      />
      <FeaturesSection 
        featureSectionRef={featureSectionRef} 
        cardPositions={cardPositions} 
        dragState={dragState} 
        handleMouseDown={handleMouseDown} 
      />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default CardStacker;
