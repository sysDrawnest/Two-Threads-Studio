import React from 'react';
import { motion } from 'framer-motion';

interface PageContainerProps {
  children: React.ReactNode;
  disablePadding?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, disablePadding = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`min-h-screen ${disablePadding ? '' : 'pt-16'} flex flex-col`}
    >
      {children}
    </motion.div>
  );
};

export default PageContainer;
