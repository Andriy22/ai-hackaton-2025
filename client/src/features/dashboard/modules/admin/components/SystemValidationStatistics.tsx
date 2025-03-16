import { ValidationStatistics } from '../../organizations/components/ValidationStatistics';
import { motion } from 'framer-motion';

/**
 * A component that displays system-wide validation statistics for super admin users
 * with enhanced visual design for the dashboard
 */
export const SystemValidationStatistics = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 rounded-xl shadow-md border border-gray-100 p-6 overflow-hidden">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-100 rounded-full opacity-20"></div>
          
          {/* Main content */}
          <div className="relative z-10">
            <ValidationStatistics />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
