import { motion } from 'framer-motion';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders above ₹999',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7-day hassle-free returns',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    description: 'Available 24/7 for you',
  },
];

const WhyShopWithUs = () => {
  return (
    <section className="py-10 sm:py-14 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/5 text-primary mb-3">
                <feature.icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-button text-sm sm:text-base font-semibold text-dark">
                {feature.title}
              </h3>
              <p className="text-text-muted text-xs sm:text-sm mt-0.5">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyShopWithUs;
