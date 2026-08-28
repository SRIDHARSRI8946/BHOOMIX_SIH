import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface GsapTextAnimationProps {
  text: string;
  type?: 'split-char' | 'fade-up' | 'gradient-glow' | 'stagger-words';
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  highlightWords?: string[];
}

export const GsapTextAnimation: React.FC<GsapTextAnimationProps> = ({
  text,
  type = 'split-char',
  className = '',
  delay = 0.1,
  duration = 0.8,
  stagger = 0.03,
  highlightWords = [],
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (type === 'split-char') {
        const chars = containerRef.current?.querySelectorAll('.gsap-char');
        if (chars && chars.length > 0) {
          gsap.fromTo(
            chars,
            {
              opacity: 0,
              y: 20,
              rotateX: -90,
              filter: 'blur(4px)',
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: 'blur(0px)',
              duration: duration,
              stagger: stagger,
              delay: delay,
              ease: 'back.out(1.7)',
            }
          );
        }
      } else if (type === 'stagger-words') {
        const words = containerRef.current?.querySelectorAll('.gsap-word');
        if (words && words.length > 0) {
          gsap.fromTo(
            words,
            {
              opacity: 0,
              y: 30,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: duration,
              stagger: stagger * 3,
              delay: delay,
              ease: 'power3.out',
            }
          );
        }
      } else if (type === 'gradient-glow') {
        gsap.fromTo(
          containerRef.current,
          {
            backgroundPosition: '0% 50%',
            opacity: 0,
            y: 15,
          },
          {
            backgroundPosition: '200% 50%',
            opacity: 1,
            y: 0,
            duration: duration * 1.5,
            delay: delay,
            ease: 'power2.out',
          }
        );
      } else {
        // fade-up
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: duration, delay: delay, ease: 'power3.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [text, type, delay, duration, stagger]);

  // Render character by character for split-char
  if (type === 'split-char') {
    const chars = text.split('');
    return (
      <span ref={containerRef} className={`inline-block perspective-500 ${className}`}>
        {chars.map((char, index) => (
          <span
            key={index}
            className="gsap-char inline-block whitespace-pre transform-gpu origin-bottom"
          >
            {char}
          </span>
        ))}
      </span>
    );
  }

  // Render word by word for stagger-words
  if (type === 'stagger-words') {
    const words = text.split(' ');
    return (
      <span ref={containerRef} className={`inline-block ${className}`}>
        {words.map((word, index) => {
          const isHighlight = highlightWords.includes(word);
          return (
            <span
              key={index}
              className={`gsap-word inline-block mr-[0.25em] ${
                isHighlight ? 'text-emerald-400 font-extrabold' : ''
              }`}
            >
              {word}
            </span>
          );
        })}
      </span>
    );
  }

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {text}
    </span>
  );
};

export default GsapTextAnimation;
