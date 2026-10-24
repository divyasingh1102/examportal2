import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2, MapPin, CreditCard, Package, ArrowRight, User, Mail, Hash } from 'lucide-react';
import { CampusItem, ItemOrder } from '../types/campus';
import { mockCampusItems } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useCampus } from '../context/CampusContext';

interface StoreItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItemId?: string;
}

export const StoreItemModal: React.FC<StoreItemModalProps> = ({
  isOpen,
  onClose,
  initialItemId = 'item-1'
}) => {
  const { student, cardBalance, showToast } = useCampus();

  const [selectedItemId, setSelectedItemId] = useState<string>(initialItemId);
  const [buyerName, setBuyerName] = useState<string>(student.name || 'Alex Chen');
  const [buyerId, setBuyerId] = useState<string>(student.id || '#984210');
  const [buyerEmail, setBuyerEmail] = useState<string>('alex.chen@campus.edu');
  const [pickupLocation, setPickupLocation] = useState<string>('Turing Hall Registry Desk (Room 102)');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ItemOrder | null>(null);

  if (!isOpen) return null;

  const currentItem = mockCampusItems.find((i) => i.id === selectedItemId) || mockCampusItems[0];
  const totalPrice = currentItem.price * quantity;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderNumber = `CP-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: ItemOrder = {
      id: orderNumber,
      buyerName: buyerName.trim(),
      buyerId: buyerId.trim(),
      buyerEmail: buyerEmail.trim(),
      pickupLocation,
      itemId: currentItem.id,
      itemName: currentItem.name,
      quantity,
      unitPrice: currentItem.price,
      totalPrice,
      paymentMethod: 'Campus Card Wallet',
      status: 'Confirmed',
      notes: notes.trim(),
      createdAt: new Date().toISOString()
    };

    // 1. Sync to Supabase `orders` table if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('orders').insert([
          {
            id: newOrder.id,
            buyer_name: newOrder.buyerName,
            buyer_id: newOrder.buyerId,
            buyer_email: newOrder.buyerEmail,
            pickup_location: newOrder.pickupLocation,
            item_id: newOrder.itemId,
            item_name: newOrder.itemName,
            quantity: newOrder.quantity,
            unit_price: newOrder.unitPrice,
            total_price: newOrder.totalPrice,
            payment_method: newOrder.paymentMethod,
            status: newOrder.status,
            notes: newOrder.notes
          }
        ]);

        if (error) {
          console.warn('Supabase orders table note (run SQL migration to persist in cloud):', error.message);
        } else {
          console.log('Order successfully synced to Supabase cloud database!');
        }
      } catch (err) {
        console.warn('Supabase order insert error:', err);
      }
    }

    // 2. Also save to localStorage as reliable backup
    try {
      const existing = JSON.parse(localStorage.getItem('campuspulse_orders_v1') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('campuspulse_orders_v1', JSON.stringify(existing));
    } catch (e) {
      console.warn('localStorage order save error', e);
    }

    setIsSubmitting(false);
    setConfirmedOrder(newOrder);
    showToast(`Order ${orderNumber} placed for ${currentItem.name}! Ready for pickup at ${pickupLocation}.`);
  };

  const handleReset = () => {
    setConfirmedOrder(null);
    setNotes('');
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e2e7ff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0051d5] text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0051d5]">
                Campus Supplies & Item Registry
              </span>
              <h3 className="font-bold text-base text-[#131b2e]">Order Academic Items</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#757682] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Confirmation Receipt View */
          <div className="p-8 text-center flex flex-col items-center justify-center gap-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center animate-bounce shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#047857] bg-[#d1fae5] px-2.5 py-0.5 rounded-full">
                Order Confirmed
              </span>
              <h4 className="text-xl font-extrabold text-[#131b2e] mt-2">
                Order #{confirmedOrder.id}
              </h4>
              <p className="text-xs text-[#444651] max-w-sm mt-1 leading-relaxed">
                Thank you, <strong>{confirmedOrder.buyerName}</strong>! Your order for{' '}
                <strong>{confirmedOrder.quantity}x {confirmedOrder.itemName}</strong> (${confirmedOrder.totalPrice.toFixed(2)}) is processed.
              </p>
            </div>

            <div className="w-full bg-[#faf8ff] p-4 rounded-xl border border-[#dae2fd] text-xs text-left space-y-2">
              <div className="flex items-center justify-between text-[#757682]">
                <span>Buyer Student ID:</span>
                <span className="font-mono font-bold text-[#131b2e]">{confirmedOrder.buyerId}</span>
              </div>
              <div className="flex items-center justify-between text-[#757682]">
                <span>Pickup Station:</span>
                <span className="font-semibold text-[#0051d5] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {confirmedOrder.pickupLocation}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#757682]">
                <span>Payment Method:</span>
                <span className="font-semibold text-[#131b2e]">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-[#757682] pt-1 border-t border-[#e2e7ff]">
                <span>Status:</span>
                <span className="font-bold text-[#047857]">{confirmedOrder.status}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#757682]">
              Present your student ID badge at the pickup desk to claim your item.
            </p>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl bg-[#0051d5] text-white hover:bg-[#00236f] font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              Done & Return to Portal
            </button>
          </div>
        ) : (
          /* Buyer Form & Item Selection */
          <form onSubmit={handlePlaceOrder} className="p-6 overflow-y-auto space-y-4 text-xs">
            {/* Item Selector */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#757682] mb-1.5">
                Select Course Material or Campus Item *
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {mockCampusItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedItemId === item.id
                        ? 'border-[#0051d5] bg-[#dbe1ff]/30 ring-2 ring-[#0051d5]/20'
                        : 'border-[#e2e7ff] bg-white hover:border-[#dae2fd]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#131b2e]">{item.name}</span>
                        {item.badge && (
                          <span className="text-[10px] font-bold bg-[#e2e7ff] text-[#00236f] px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#757682] mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-sm font-extrabold text-[#0051d5] shrink-0 pl-2">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buyer Details Form */}
            <div className="p-4 rounded-xl bg-[#faf8ff] border border-[#e2e7ff] space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#00236f] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Buyer Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">
                    Student ID / Roll # *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerId}
                    onChange={(e) => setBuyerId(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">
                  University Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none focus:border-[#0051d5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">
                    Pickup Location *
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none"
                  >
                    <option value="Turing Hall Registry Desk (Room 102)">Turing Hall Desk (Room 102)</option>
                    <option value="Main Library 1st Floor Service Desk">Main Library 1st Floor Desk</option>
                    <option value="Student Union Campus Bookstore Counter B">Student Union Bookstore</option>
                    <option value="Engineering Atrium Smart Lockers">Engineering Atrium Lockers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-[#dae2fd] font-bold text-sm text-[#131b2e] hover:bg-[#f2f3ff]"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-[#131b2e]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-[#dae2fd] font-bold text-sm text-[#131b2e] hover:bg-[#f2f3ff]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">
                  Special Delivery or Course Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hold for CS 301 lab session pickup"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none"
                />
              </div>
            </div>

            {/* Price & Wallet Summary */}
            <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#757682] uppercase font-bold">Total Amount Due</span>
                <p className="text-xl font-extrabold text-[#00236f]">${totalPrice.toFixed(2)}</p>
                <p className="text-[11px] text-[#444651]">
                  Available Wallet: <strong className="text-[#0051d5]">${cardBalance.toFixed(2)}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#d1fae5] text-[#047857]">
                  Instant Dispatch
                </span>
                <p className="text-[10px] text-[#757682] mt-1">Ready in ~15 mins</p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#e2e7ff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#444651] hover:text-[#131b2e] rounded-lg hover:bg-[#f2f3ff] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#0051d5] text-white hover:bg-[#00236f] font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    <span>Place Order & Collect Item</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
