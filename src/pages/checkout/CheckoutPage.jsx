import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Truck, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Package } from 'lucide-react';
import { selectCartItems, selectCartSubtotal, selectCartTotal, clearCart } from '@redux/slices/cartSlice';
import { selectCurrentUser } from '@redux/slices/authSlice';
import { formatPrice } from '@utils/formatters';
import { cn } from '@utils/cn';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Shipping', icon: Truck },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Summary', icon: CheckCircle },
];

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const user = useSelector(selectCurrentUser);
  const shipping = useSelector((state) => state.cart.shipping);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (items.length === 0 && !orderPlaced) {
    navigate('/shop');
    return null;
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.postalCode) {
        toast.error('Please fill all required fields');
        return;
      }
    }
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const placeOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setOrderPlaced(true);
    dispatch(clearCart());
    toast.success('Order placed successfully! 🎉');
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="pt-28 lg:pt-32 pb-16">
        <div className="section-container max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-success" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-2xl sm:text-3xl text-dark mb-3"
          >
            Order Placed Successfully!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary text-sm mb-2"
          >
            Thank you for shopping with Munaz, {user.firstName}!
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-text-muted text-xs mb-8"
          >
            Order #MNZ-{Date.now().toString().slice(-6)} • You'll receive a confirmation shortly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button onClick={() => navigate('/shop')} className="btn-primary gap-2">
              Continue Shopping <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/account')} className="btn-outline gap-2">
              <Package size={16} /> My Account
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 lg:pt-32 pb-16">
      <div className="section-container max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300',
                      isCompleted ? 'bg-success text-white' :
                      isActive ? 'bg-primary text-white shadow-glow' :
                      'bg-border text-text-muted'
                    )}
                  >
                    {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                  </div>
                  <span className={cn(
                    'text-[10px] sm:text-xs mt-1.5 font-medium',
                    isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-text-muted'
                  )}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-2 sm:mx-3 rounded-full transition-colors duration-300 mb-5',
                    isCompleted ? 'bg-success' : 'bg-border'
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-surface rounded-xl border border-border p-5 sm:p-6"
              >
                {/* Step 1: Address */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="font-heading text-lg text-dark mb-5">Shipping Address</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-dark mb-1">Full Name *</label>
                        <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} placeholder="Enter your full name" className="input-base text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-dark mb-1">Phone Number *</label>
                        <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="Enter phone number" className="input-base text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-dark mb-1">Postal Code *</label>
                        <input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} placeholder="Enter postal code" className="input-base text-sm" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-dark mb-1">Address Line 1 *</label>
                        <input value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} placeholder="House no, street, area" className="input-base text-sm" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-dark mb-1">Address Line 2</label>
                        <input value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} placeholder="Landmark (optional)" className="input-base text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-dark mb-1">City *</label>
                        <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" className="input-base text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-dark mb-1">State *</label>
                        <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="State" className="input-base text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="font-heading text-lg text-dark mb-5">Shipping Method</h2>
                    <div className="space-y-3">
                      {[
                        { id: 'standard', label: 'Standard Delivery', time: '5-7 business days', price: 'Free (orders above ₹500)' },
                        { id: 'express', label: 'Express Delivery', time: '2-3 business days', price: '₹99' },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                            shippingMethod === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          )}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={shippingMethod === method.id}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-dark">{method.label}</p>
                            <p className="text-xs text-text-muted">{method.time}</p>
                          </div>
                          <span className="text-sm font-medium text-primary">{method.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="font-heading text-lg text-dark mb-5">Payment Method</h2>
                    <div className="space-y-3">
                      {[
                        { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order', icon: '💵' },
                        { id: 'upi', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm', icon: '📱' },
                        { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                            paymentMethod === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          )}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-xl">{method.icon}</span>
                          <div>
                            <p className="text-sm font-semibold text-dark">{method.label}</p>
                            <p className="text-xs text-text-muted">{method.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Summary */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="font-heading text-lg text-dark mb-5">Order Summary</h2>

                    {/* Address Summary */}
                    <div className="bg-background rounded-lg p-4 mb-4">
                      <p className="text-xs font-medium text-text-muted uppercase mb-1">Delivering to</p>
                      <p className="text-sm font-semibold text-dark">{address.fullName}</p>
                      <p className="text-xs text-text-secondary">{address.addressLine1}, {address.city}, {address.state} - {address.postalCode}</p>
                      <p className="text-xs text-text-secondary">Phone: {address.phone}</p>
                    </div>

                    {/* Items */}
                    <div className="space-y-3 mb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center">
                          <img src={item.image} alt={item.name} className="w-12 h-14 rounded-md object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-dark truncate">{item.name}</p>
                            <p className="text-xs text-text-muted">{item.size} • {item.color} • Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-bold text-dark">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Payment & Shipping info */}
                    <div className="bg-background rounded-lg p-4">
                      <div className="flex justify-between text-xs text-text-secondary mb-1">
                        <span>Shipping:</span>
                        <span className="capitalize">{shippingMethod} Delivery</span>
                      </div>
                      <div className="flex justify-between text-xs text-text-secondary">
                        <span>Payment:</span>
                        <span className="capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : 'Card'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  {currentStep > 1 ? (
                    <button onClick={prevStep} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-dark transition-colors">
                      <ArrowLeft size={16} /> Back
                    </button>
                  ) : <div />}

                  {currentStep < 4 ? (
                    <button onClick={nextStep} className="btn-primary gap-2 text-sm py-2.5 px-5">
                      Continue <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button onClick={placeOrder} disabled={isProcessing} className="btn-primary gap-2 text-sm py-2.5 px-5">
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Place Order <CheckCircle size={16} /></>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Total Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-xl border border-border p-5 sticky top-32">
              <h3 className="font-heading text-base text-dark mb-4">Order Total</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-success">Free</span> : formatPrice(shipping)}</span>
                </div>
                {shippingMethod === 'express' && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Express Fee</span>
                    <span>₹99</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-dark text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(total + (shippingMethod === 'express' ? 99 : 0))}</span>
                </div>
              </div>

              {/* Mini item list */}
              <div className="border-t border-border pt-3 space-y-2">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <img src={item.image} alt="" className="w-8 h-10 rounded object-cover" />
                    <p className="text-xs text-text-secondary truncate flex-1">{item.name}</p>
                    <span className="text-xs font-medium">×{item.quantity}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-text-muted">+{items.length - 3} more items</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
