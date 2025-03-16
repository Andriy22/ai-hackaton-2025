import { motion } from 'framer-motion';

const LoadingState = () => (
  <div className="flex h-64 items-center justify-center">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className="relative mx-auto mb-4">
        <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-transparent animate-spin"></div>
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-md"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      </div>
      <motion.p 
        className="text-lg font-medium bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading organizations...
      </motion.p>
      <p className="mt-2 text-sm text-gray-500">
        This may take a moment
      </p>
    </motion.div>
  </div>
);

export default LoadingState;
