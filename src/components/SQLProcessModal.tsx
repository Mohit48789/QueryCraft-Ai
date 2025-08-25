import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { Database, MessageSquare, Search, Code, CheckCircle, AlertCircle } from 'lucide-react';

interface SQLProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  naturalLanguageQuery: string;
  sqlQuery: string;
  isDarkMode?: boolean;
}

interface ProcessStep {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end';
  title: string;
  description: string;
  details: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'active' | 'completed';
}

export const SQLProcessModal: React.FC<SQLProcessModalProps> = ({
  isOpen,
  onClose,
  naturalLanguageQuery,
  sqlQuery,
  isDarkMode = true
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const processSteps: ProcessStep[] = [
    {
      id: 'start',
      type: 'start',
      title: 'Start Process',
      description: 'User Input Received',
      details: `Natural Language Query: "${naturalLanguageQuery}"`,
      icon: Play,
      status: 'pending'
    },
    {
      id: 'parse',
      type: 'process',
      title: 'Parse Natural Language',
      description: 'AI analyzes the input text',
      details: 'Breaking down the query into meaningful components and identifying key entities, actions, and relationships.',
      icon: MessageSquare,
      status: 'pending'
    },
    {
      id: 'intent',
      type: 'decision',
      title: 'Analyze Intent',
      description: 'What does the user want?',
      details: 'Determining the type of operation (SELECT, INSERT, UPDATE, DELETE) and identifying the data requirements.',
      icon: Search,
      status: 'pending'
    },
    {
      id: 'schema',
      type: 'process',
      title: 'Schema Mapping',
      description: 'Map to database structure',
      details: 'Identifying relevant tables, columns, and relationships in the database schema that match the query intent.',
      icon: Database,
      status: 'pending'
    },
    {
      id: 'validate',
      type: 'decision',
      title: 'Validate Query',
      description: 'Check if query is valid',
      details: 'Ensuring the generated SQL follows proper syntax rules and references existing database objects.',
      icon: AlertCircle,
      status: 'pending'
    },
    {
      id: 'generate',
      type: 'process',
      title: 'Generate SQL',
      description: 'Create optimized SQL statement',
      details: 'Constructing the final SQL query with proper syntax, joins, conditions, and optimizations.',
      icon: Code,
      status: 'pending'
    },
    {
      id: 'complete',
      type: 'end',
      title: 'Process Complete',
      description: 'SQL Query Ready',
      details: `Generated SQL: ${sqlQuery}`,
      icon: CheckCircle,
      status: 'pending'
    }
  ];

  const [steps, setSteps] = useState(processSteps);

  useEffect(() => {
    if (isPlaying && hasStarted) {
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [isPlaying, hasStarted, steps.length]);

  // Auto-scroll functionality
  const scrollToStep = (stepIndex: number) => {
    if (modalContentRef.current && stepRefs.current[stepIndex]) {
      const stepElement = stepRefs.current[stepIndex];
      const modalElement = modalContentRef.current;
      
      if (stepElement) {
        const stepTop = stepElement.offsetTop;
        const modalScrollTop = modalElement.scrollTop;
        const modalHeight = modalElement.clientHeight;
        const stepHeight = stepElement.clientHeight;
        
        // Calculate the position to center the step in the modal
        const targetScrollTop = stepTop - (modalHeight / 2) + (stepHeight / 2);
        
        modalElement.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    setSteps(prevSteps => 
      prevSteps.map((step, index) => ({
        ...step,
        status: index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending'
      }))
    );
    
    // Auto-scroll to current step
    if (hasStarted) {
      setTimeout(() => scrollToStep(currentStep), 300);
    }
  }, [currentStep, hasStarted]);

  const handlePlay = () => {
    setIsPlaying(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setHasStarted(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setHasStarted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepShape = (type: string) => {
    switch (type) {
      case 'start':
      case 'end':
        return 'rounded-full';
      case 'decision':
        return 'transform rotate-45';
      default:
        return 'rounded-lg';
    }
  };

  const getStepColor = (type: string, status: string) => {
    const baseColors = {
      start: isDarkMode ? 'border-green-400' : 'border-green-600',
      end: isDarkMode ? 'border-blue-400' : 'border-blue-600',
      decision: isDarkMode ? 'border-yellow-400' : 'border-yellow-600',
      process: isDarkMode ? 'border-purple-400' : 'border-purple-600'
    };

    const bgColors = {
      pending: isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100',
      active: isDarkMode ? 'bg-blue-500/30' : 'bg-blue-200',
      completed: isDarkMode ? 'bg-green-500/30' : 'bg-green-200'
    };

    return `${baseColors[type as keyof typeof baseColors]} ${bgColors[status as keyof typeof bgColors]}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          ref={modalContentRef}
          className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-700' 
              : 'bg-white border-gray-300'
          } shadow-2xl`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              SQL Query Creation Process
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Controls */}
          <div className={`flex items-center justify-center gap-4 p-4 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`p-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  : isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className={`p-3 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={handleReset}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={`p-2 rounded-lg transition-colors ${
                currentStep === steps.length - 1
                  ? isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  : isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Process Visualization */}
          <div className="p-8">
            <div className="flex flex-col items-center space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  ref={(el) => (stepRefs.current[index] = el)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: hasStarted ? 1 : index === 0 ? 1 : 0.3,
                    y: 0,
                    scale: step.status === 'active' ? 1.05 : 1
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  {/* Step Node */}
                  <div className={`relative p-6 border-2 ${getStepColor(step.type, step.status)} ${
                    step.type === 'decision' ? 'w-40 h-40' : 'w-56 h-32'
                  } ${getStepShape(step.type)} flex items-center justify-center transition-all duration-500`}>
                    <div className={`${step.type === 'decision' ? 'transform -rotate-45' : ''} text-center`}>
                      <step.icon className={`w-8 h-8 mx-auto mb-3 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`} />
                      <div className={`text-lg font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-sm opacity-80 mt-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {/* Step Details */}
                  {step.status === 'active' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-4 p-4 rounded-lg max-w-md text-center ${
                        isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {step.details}
                    </motion.div>
                  )}

                  {/* Arrow to next step */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hasStarted && index <= currentStep ? 1 : 0.3 }}
                      className="my-4"
                    >
                      <div className={`w-1 h-12 ${
                        isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
                      } rounded-full`} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="mt-8 flex justify-center">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
