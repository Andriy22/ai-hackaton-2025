import useAuthStore from '@/features/auth/store/useAuthStore';
import useValidationStore from '@/features/validation/store/useValidationStore';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircleIcon, EyeIcon, ShieldCheckIcon, UploadCloudIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Import components
import EmployeeDetails from '@/features/validation/components/EmployeeDetails';
import OrganizationRequired from '@/features/validation/components/OrganizationRequired';
import ValidationDropzone from '@/features/validation/components/ValidationDropzone';
import ValidationResultComponent from '@/features/validation/components/ValidationResult';
import ValidationStatus, { ValidationStatusType } from '@/features/validation/components/ValidationStatus';

// Custom animation styles
const confettiAnimations = {
  confetti1: "absolute w-2 h-2 bg-yellow-500 rounded-full animate-[confetti1_3s_ease-in-out_infinite]",
  confetti2: "absolute w-3 h-3 bg-blue-500 rounded-full animate-[confetti2_2.8s_ease-in-out_infinite]", 
  confetti3: "absolute w-2 h-2 bg-green-500 rounded-full animate-[confetti3_2.5s_ease-in-out_infinite]",
  confetti4: "absolute w-3 h-3 bg-pink-500 rounded-full animate-[confetti4_3.2s_ease-in-out_infinite]",
  confetti5: "absolute w-2 h-2 bg-purple-500 rounded-full animate-[confetti5_2.7s_ease-in-out_infinite]",
  confetti6: "absolute w-4 h-4 bg-teal-500 rounded-full animate-[confetti6_3s_ease-in-out_infinite]",
};


const ValidationPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    file, 
    validationResult, 
    employee, 
    status, 
    error, 
    setFile, 
    validateImage 
  } = useValidationStore();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Update active step based on status
  useEffect(() => {
    if (status === ValidationStatusType.IDLE) {
      setActiveStep(0);
    } else if (status === ValidationStatusType.UPLOADING) {
      setActiveStep(1);
    } else if (status === ValidationStatusType.SUCCESS) {
      setActiveStep(2);
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Early return if no organization ID
  if (!user?.organizationId) {
    return <OrganizationRequired />;
  }

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleValidate = async () => {
    if (!user?.organizationId) return;
    await validateImage(user.organizationId);
  };
  
  const isProcessing = status === ValidationStatusType.UPLOADING;
  const isSuccess = status === ValidationStatusType.SUCCESS;
  const isError = status === ValidationStatusType.ERROR;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-10 pb-20">
      {/* Background decorations with inline keyframe styles */}
      <style>{`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(30px, -50px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }
        @keyframes confetti1 {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(-100px, -300px) rotate(720deg); opacity: 0; }
        }
        @keyframes confetti2 {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(200px, -200px) rotate(-720deg); opacity: 0; }
        }
        @keyframes confetti3 {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(-150px, -240px) rotate(840deg); opacity: 0; }
        }
        @keyframes confetti4 {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(120px, -300px) rotate(-540deg); opacity: 0; }
        }
        @keyframes confetti5 {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(-180px, -200px) rotate(720deg); opacity: 0; }
        }
        @keyframes confetti6 {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(250px, -350px) rotate(-1080deg); opacity: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animation: "blob 7s infinite" }}></div>
      <div className="absolute top-40 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animation: "blob 7s infinite 2s" }}></div>
      <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animation: "blob 7s infinite 4s" }}></div>
      
      {/* Confetti animation on success */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={confettiAnimations.confetti1} style={{ left: "50%", top: "50%" }}></div>
            <div className={confettiAnimations.confetti2} style={{ left: "52%", top: "48%" }}></div>
            <div className={confettiAnimations.confetti3} style={{ left: "48%", top: "52%" }}></div>
            <div className={confettiAnimations.confetti4} style={{ left: "47%", top: "53%" }}></div>
            <div className={confettiAnimations.confetti5} style={{ left: "53%", top: "47%" }}></div>
            <div className={confettiAnimations.confetti6} style={{ left: "51%", top: "49%" }}></div>
            
            {/* Additional confetti particles */}
            <div className={confettiAnimations.confetti1} style={{ left: "54%", top: "46%", animationDelay: "0.5s" }}></div>
            <div className={confettiAnimations.confetti2} style={{ left: "46%", top: "54%", animationDelay: "0.3s" }}></div>
            <div className={confettiAnimations.confetti3} style={{ left: "55%", top: "45%", animationDelay: "0.7s" }}></div>
            <div className={confettiAnimations.confetti4} style={{ left: "45%", top: "55%", animationDelay: "0.2s" }}></div>
            <div className={confettiAnimations.confetti5} style={{ left: "49%", top: "51%", animationDelay: "0.6s" }}></div>
            <div className={confettiAnimations.confetti6} style={{ left: "51%", top: "49%", animationDelay: "0.9s" }}></div>
            
            {/* Success pulse ring animation */}
            <div className="absolute w-32 h-32 rounded-full border-4 border-green-500 opacity-0" 
                 style={{ animation: "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite" }}></div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <EyeIcon className="h-10 w-10 text-teal-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Retina Validation System
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure identity verification through advanced retina scanning technology
          </p>
        </motion.div>
        
        {/* Progress Steps */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 md:text-base">
            {[
              { icon: <UploadCloudIcon className="w-5 h-5" />, label: "Upload" },
              { icon: <ShieldCheckIcon className="w-5 h-5" />, label: "Validation" },
              { icon: <CheckCircleIcon className="w-5 h-5" />, label: "Results" }
            ].map((step, index) => (
              <li key={index} className={`flex ${index < 2 ? 'md:w-full' : ''} items-center ${activeStep >= index ? 'text-teal-600' : 'text-gray-500'}`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors duration-300 ${activeStep >= index ? 'bg-teal-100 text-teal-600' : 'bg-gray-100'}`}>
                  {step.icon}
                </span>
                <span className="hidden md:inline-flex ms-2">{step.label}</span>
                {index < 2 && <span className="flex-grow border-t border-gray-300 mx-6 hidden md:inline-flex"></span>}
              </li>
            ))}
          </ol>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Main content area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-1">
              <div className={`h-1.5 rounded-full transition-colors duration-500 ${isProcessing ? 'bg-indigo-500 animate-pulse' : isSuccess ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-gray-200'}`}></div>
            </div>
            
            <div className="p-8">
              {/* File upload dropzone */}
              <AnimatePresence mode="wait">
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <ValidationDropzone 
                    file={file}
                    onFileChange={handleFileChange}
                    isUploading={status === ValidationStatusType.UPLOADING}
                    onValidate={handleValidate}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Status indicator */}
              <AnimatePresence>
                {(status !== ValidationStatusType.IDLE) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <ValidationStatus status={status} error={error} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Results section */}
              <AnimatePresence>
                {isSuccess && validationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 mt-4"
                  >
                    <ValidationResultComponent result={validationResult} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Employee details */}
              <AnimatePresence>
                {isSuccess && employee && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gradient-to-br from-white to-teal-50 rounded-xl p-6 border border-teal-100 shadow-sm"
                  >
                    <EmployeeDetails employee={employee} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Information cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
          >
            {[
              {
                icon: <ShieldCheckIcon className="h-5 w-5 text-teal-600" />,
                title: "Secure Verification",
                description: "State-of-the-art retina scanning technology ensures accurate and reliable identity verification.",
                bgColor: "bg-teal-100"
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>,
                title: "Instant Results",
                description: "Get validation results within seconds, enhancing efficiency in security processes.",
                bgColor: "bg-indigo-100"
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>,
                title: "Advanced Security",
                description: "Multiple layers of security ensure that sensitive data remains protected at all times.",
                bgColor: "bg-purple-100"
              }
            ].map((card, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.4 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300"
              >
                <div className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPage;
