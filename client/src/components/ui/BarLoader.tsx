import React from "react";
import { motion, Variants } from "framer-motion";

const variants: Variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0.3,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

interface BarLoaderProps {
  barColor?: string; // e.g. "bg-emerald-500", "bg-emerald-400", "bg-slate-900"
  height?: string;   // e.g. "h-12", "h-10", "h-16"
  width?: string;    // e.g. "w-2", "w-1.5", "w-3"
  className?: string;
}

export const BarLoader: React.FC<BarLoaderProps> = ({
  barColor = "bg-emerald-500",
  height = "h-12",
  width = "w-2",
  className = "",
}) => {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.15,
      }}
      initial="initial"
      animate="animate"
      className={`flex items-center justify-center gap-1.5 ${className}`}
    >
      <motion.div variants={variants} className={`${height} ${width} ${barColor} rounded-full shadow-sm`} />
      <motion.div variants={variants} className={`${height} ${width} ${barColor} rounded-full shadow-sm`} />
      <motion.div variants={variants} className={`${height} ${width} ${barColor} rounded-full shadow-sm`} />
      <motion.div variants={variants} className={`${height} ${width} ${barColor} rounded-full shadow-sm`} />
      <motion.div variants={variants} className={`${height} ${width} ${barColor} rounded-full shadow-sm`} />
    </motion.div>
  );
};

export default BarLoader;
