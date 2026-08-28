import React from 'react';
import { motion } from 'framer-motion';

interface TextShadowsProps {
  text: string;
  className?: string;
  shadowColor?: string; // e.g. "#10b981", "#3b82f6", "#8b5cf6"
  glowIntensity?: 'soft' | 'medium' | 'intense';
}

export const TextShadows: React.FC<TextShadowsProps> = ({
  text,
  className = '',
  shadowColor = '#10b981',
  glowIntensity = 'medium',
}) => {
  const glowMap = {
    soft: `0 0 10px ${shadowColor}40, 0 0 20px ${shadowColor}20`,
    medium: `0 0 15px ${shadowColor}80, 0 0 30px ${shadowColor}40, 0 0 45px ${shadowColor}20`,
    intense: `0 0 20px ${shadowColor}, 0 0 40px ${shadowColor}90, 0 0 60px ${shadowColor}50`,
  };

  return (
    <motion.span
      initial={{ opacity: 0, y: 5 }}
      animate={{
        opacity: 1,
        y: 0,
        textShadow: [
          glowMap[glowIntensity],
          `0 0 25px ${shadowColor}, 0 0 50px ${shadowColor}80`,
          glowMap[glowIntensity],
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      }}
      className={`inline-block font-extrabold tracking-tight ${className}`}
      style={{
        textShadow: glowMap[glowIntensity],
      }}
    >
      {text}
    </motion.span>
  );
};

export default TextShadows;
