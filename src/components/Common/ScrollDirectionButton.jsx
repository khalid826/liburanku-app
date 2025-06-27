import React, { useEffect, useState, useRef } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

const ScrollDirectionButton = () => {
  const [show, setShow] = useState(false);
  const [direction, setDirection] = useState('down'); // 'down' or 'up'
  const lastScrollY = useRef(window.scrollY);
  const timer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current) {
        setDirection('down');
        setShow(true);
        resetTimer();
      } else if (currentY < lastScrollY.current) {
        setDirection('up');
        setShow(true);
        resetTimer();
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2000);
  };

  const handleClick = () => {
    if (direction === 'down') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setShow(false);
  };

  return (
    <div className="fixed left-1/2 bottom-8 z-50 -translate-x-1/2 flex items-center justify-center pointer-events-none">
      <button
        onClick={handleClick}
        className={`pointer-events-auto flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-[#0B7582] hover:bg-[#095e68] text-white rounded-full shadow-lg transition-all duration-300 transform ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} animate-fade-in`}
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        aria-label={direction === 'down' ? 'Scroll to bottom' : 'Scroll to top'}
      >
        {direction === 'down' ? <ArrowDown size={20} className="sm:w-7 sm:h-7" /> : <ArrowUp size={20} className="sm:w-7 sm:h-7" />}
      </button>
    </div>
  );
};

export default ScrollDirectionButton; 