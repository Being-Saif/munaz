import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronLeft, ShoppingBag } from 'lucide-react';
import useApi from '@hooks/useApi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const MyOrdersPage = () => {
  const { data: ordersData, loading } = useApi('/orders');
  const orders = ordersData?.data || ordersData || [];

  return (
    <div className="pt-28 lg:pt-32 pb-16">
      <div className="section-container max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/account" className="p-2 rounded-lg hover:bg-primary/5 transition-colors">
            <ChevronLeft size={20} className="text-dark" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-dark">My Orders</h1>
            <p className="text-text-secondary text-sm">Track and manage your orders</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl border border-border"
          >
            <ShoppingBag size={48} className="mx-auto mb-4 text-primary/30" />
            <h3 className="font-heading text-lg font-semibold text-dark mb-2">No orders yet</h3>
            <p className="text-text-secondary text-sm mb-5">Start shopping to see your orders here</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
              Start Shopping
            </Link>
          </motion.div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id || order.orderNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-dark">#{order.orderNumber}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                    <span className="font-button text-sm font-semibold text-dark">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {order.items?.slice(0, 4).map((item, i) => (
                    <div key={i} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                      <img src={item.thumbnail || item.product?.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <span className="text-xs text-text-muted flex-shrink-0">+{order.items.length - 4} more</span>
                  )}
                  <div className="flex-1" />
                  <span className="text-xs text-text-muted">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
