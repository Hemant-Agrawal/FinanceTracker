'use client';

import { motion } from 'framer-motion';

interface BackdropProps {
  onClick: () => void;
}

export function Backdrop({ onClick }: BackdropProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
    />
  );
}
