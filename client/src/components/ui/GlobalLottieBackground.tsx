import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

interface GlobalLottieBackgroundProps {
  opacity?: number;
  invert?: boolean;
  className?: string;
}

export const GlobalLottieBackground: React.FC<GlobalLottieBackgroundProps> = ({
  opacity = 0.85,
  invert = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('/Global.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load Global.json Lottie file:', err));
  }, []);

  useEffect(() => {
    if (!animationData || !containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    return () => {
      anim.destroy();
    };
  }, [animationData]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center ${className}`}
      style={{
        opacity,
        filter: invert ? 'invert(0.95) contrast(2)' : 'none',
      }}
    >
      <div
        ref={containerRef}
        className="w-full h-full max-w-[1920px] max-h-[1080px] flex items-center justify-center scale-110"
      />
    </div>
  );
};

export default GlobalLottieBackground;
