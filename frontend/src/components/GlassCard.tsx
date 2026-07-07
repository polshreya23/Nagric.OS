import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverScale?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverScale = true
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverScale ? { scale: 1.015, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      className={`glass-panel glass-glow rounded-2xl p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-indigo-500/5' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
export default GlassCard;
