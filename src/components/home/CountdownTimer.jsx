import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endTime) - new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const timeBlocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Mins' },
    { value: timeLeft.seconds, label: 'Secs' },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {timeBlocks.map((block, index) => (
        <div key={block.label} className="flex items-center gap-2 sm:gap-3">
          <div className="text-center">
            <motion.div
              key={block.value}
              initial={{ y: -5, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20"
            >
              <span className="font-button text-xl sm:text-2xl font-bold text-white">
                {String(block.value).padStart(2, '0')}
              </span>
            </motion.div>
            <p className="text-white/60 text-[10px] sm:text-xs mt-1 font-body">
              {block.label}
            </p>
          </div>
          {index < timeBlocks.length - 1 && (
            <span className="text-white/40 text-xl font-bold mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
