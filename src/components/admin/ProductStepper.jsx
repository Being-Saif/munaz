import { Check } from 'lucide-react';
import { cn } from '@utils/cn';

const STEPS = [
  { id: 1, label: 'Add Product' },
  { id: 2, label: 'Basic Details' },
  { id: 3, label: 'Additional Details' },
  { id: 4, label: 'Variants' },
  { id: 5, label: 'Review & Submit' },
];

/**
 * ProductStepper - 5-step progress indicator for the product upload wizard
 * @param {number} currentStep - the active step (1-5)
 * @param {boolean} darkMode
 * @param {(step: number) => void} [onStepClick] - optional, allows jumping to completed steps
 */
const ProductStepper = ({ currentStep, darkMode, onStepClick }) => {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-max sm:min-w-0">
        {STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isClickable = isCompleted && onStepClick;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle + label */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={cn('flex items-center gap-2.5 shrink-0', isClickable && 'cursor-pointer')}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors duration-300',
                    isCompleted && 'bg-primary text-white',
                    isActive && 'bg-primary text-white ring-4 ring-primary/20',
                    !isCompleted && !isActive && (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400')
                  )}
                >
                  {isCompleted ? <Check size={15} /> : step.id}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium whitespace-nowrap hidden sm:inline',
                    isActive && (darkMode ? 'text-white' : 'text-gray-900'),
                    isCompleted && 'text-primary',
                    !isCompleted && !isActive && (darkMode ? 'text-gray-500' : 'text-gray-400')
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 sm:mx-3 min-w-[24px] transition-colors duration-300',
                    isCompleted ? 'bg-primary' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductStepper;
export { STEPS };
