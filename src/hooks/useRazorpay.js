import { useState } from 'react';
import api from '@services/api';
import toast from 'react-hot-toast';

/**
 * Hook to handle Razorpay payment flow
 */
const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async ({ amount, orderId, customerName, customerEmail, customerPhone, onSuccess, onFailure }) => {
    setLoading(true);

    // Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Payment gateway failed to load. Check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      // Create order on backend
      const res = await api.post('/payment/create-order', {
        amount,
        receipt: orderId || `order_${Date.now()}`,
      });

      const { data } = res;

      // Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Munaz',
        description: 'Fashion & Lifestyle',
        order_id: data.orderId,
        prefill: {
          name: customerName || '',
          email: customerEmail || '',
          contact: customerPhone || '',
        },
        theme: {
          color: '#7E57C2',
        },
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              toast.success('Payment successful! ✓');
              onSuccess?.(response);
            } else {
              toast.error('Payment verification failed');
              onFailure?.('Verification failed');
            }
          } catch (err) {
            toast.error('Payment verification failed');
            onFailure?.(err.message);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            onFailure?.('Payment cancelled');
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message || 'Failed to initiate payment');
      onFailure?.(error.message);
    }

    setLoading(false);
  };

  return { initiatePayment, loading };
};

export default useRazorpay;
