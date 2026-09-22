import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@utils/cn';

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 5–7 business days. Express delivery, where available, arrives in 2–3 business days. You can track your order status under My Account → Orders.',
  },
  {
    q: 'What are the shipping charges?',
    a: 'A small flat shipping fee applies to smaller orders, and orders above our free-shipping threshold ship free. Exact charges are shown at checkout and on our Shipping Information page.',
  },
  {
    q: 'Can I return or exchange an item?',
    a: 'Yes. You can request a return within our return window for unused, unwashed items in original condition with tags intact. See our Returns page for full details.',
  },
  {
    q: 'How do I choose the right size?',
    a: 'Check our Size Guide for detailed measurements. Many products also include their own specific size chart on the product page.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery (COD) as well as online payments via UPI, credit/debit cards, and net banking through our secure payment gateway.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once logged in, go to My Account → Orders to see the status of each order. You will also receive an order confirmation email when you place an order.',
  },
  {
    q: 'I forgot my password. What do I do?',
    a: 'Click "Forgot Password" on the login page, enter your email, and we will send you a link to reset your password.',
  },
];

const FaqItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-dark">{item.q}</span>
        <ChevronDown size={18} className={cn('text-primary flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  );
};

const FaqPage = () => {
  return (
    <div className="pt-6 lg:pt-8 pb-16">
      <div className="section-container max-w-3xl mx-auto">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-2">Frequently Asked Questions</h1>
        <p className="text-text-secondary text-sm mb-8">Answers to the questions we get asked most.</p>

        <div className="space-y-3">
          {FAQS.map((item, i) => <FaqItem key={i} item={item} />)}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
