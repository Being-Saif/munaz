import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const NewsletterBanner = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary via-primary-dark to-primary relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto"
        >
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-3">
            Stay in the Loop
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-6 sm:mb-8">
            Subscribe to get exclusive offers, early access to new collections, and style inspiration.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4"
            >
              <p className="text-white font-button font-medium">
                ✓ Thank you! You&apos;re on the list.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 font-body text-sm focus:outline-none focus:border-white/50 transition-colors duration-300"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary font-button text-sm font-semibold rounded-lg hover:bg-secondary hover:text-white transition-all duration-300"
              >
                Subscribe
                <Send size={14} />
              </button>
            </form>
          )}

          <p className="text-white/40 text-xs mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
