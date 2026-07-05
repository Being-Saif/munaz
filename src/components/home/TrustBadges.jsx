import { motion } from 'framer-motion';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import { TRUST_BADGES } from '@utils/constants';

const iconMap = {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
};

const TrustBadges = () => {
  return (
    <section className="section-container py-8 lg:py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x divide-border">
        {TRUST_BADGES.map((badge, index) => {
          const Icon = iconMap[badge.icon];
          return (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-3 lg:justify-center lg:px-6"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-body text-sm font-semibold text-dark">
                  {badge.title}
                </h4>
                <p className="text-text-muted text-xs">
                  {badge.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustBadges;
