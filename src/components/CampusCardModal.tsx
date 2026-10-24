import React, { useState } from 'react';
import { X, CreditCard, DollarSign, PlusCircle, ArrowDownLeft, ArrowUpRight, CheckCircle2, ShoppingBag } from 'lucide-react';

interface CampusCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onAddFunds: (amount: number) => void;
  onOpenStore?: () => void;
}

export const CampusCardModal: React.FC<CampusCardModalProps> = ({
  isOpen,
  onClose,
  balance,
  onAddFunds,
  onOpenStore
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTopUp = () => {
    onAddFunds(selectedAmount);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  const transactions = [
    { id: 'tx-1', desc: 'Turing Library Café - Latte & Bagel', amount: -6.50, date: 'Today, 9:15 AM' },
    { id: 'tx-2', desc: 'Bookstore - CS 380 Course Packet', amount: -18.00, date: 'Yesterday' },
    { id: 'tx-3', desc: 'Dining Dollars Automatic Reload', amount: +50.00, date: 'Mar 15' },
    { id: 'tx-4', desc: 'Print Station - 15 Pages Lab 2', amount: -1.50, date: 'Mar 14' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#e2e7ff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0051d5] text-white flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0051d5]">Student Financial Wallet</span>
              <h3 className="font-bold text-base text-[#131b2e]">Campus Card & Dining Dollars</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#757682] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#131b2e]">Funds Added Successfully!</h4>
            <p className="text-xs text-[#444651]">
              ${selectedAmount.toFixed(2)} credited to your Campus Card. New balance: ${(balance + selectedAmount).toFixed(2)}.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Balance Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#00236f] to-[#0051d5] text-white flex items-center justify-between shadow-md">
              <div>
                <p className="text-xs text-[#90a8ff] font-medium">Available Balance</p>
                <h3 className="text-3xl font-extrabold tracking-tight mt-1">${balance.toFixed(2)}</h3>
                <p className="text-[11px] text-[#dbe1ff] mt-2 font-mono">CARD ID: **** 9842 (Alex Chen)</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
                <CreditCard className="w-8 h-8 text-[#90a8ff]" />
              </div>
            </div>

            {/* Quick Add Funds */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#757682] mb-2">
                Quick Reload
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedAmount === amt
                        ? 'bg-[#0051d5] text-white border-[#0051d5] shadow-xs'
                        : 'bg-white text-[#131b2e] border-[#e2e7ff] hover:border-[#dae2fd]'
                    }`}
                  >
                    +${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#757682] mb-2">
                Recent Transactions
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {transactions.map(tx => (
                  <div key={tx.id} className="p-2.5 rounded-lg bg-[#faf8ff] border border-[#f2f3ff] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-md ${tx.amount > 0 ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#f2f3ff] text-[#444651]'}`}>
                        {tx.amount > 0 ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-[#131b2e]">{tx.desc}</p>
                        <p className="text-[10px] text-[#757682]">{tx.date}</p>
                      </div>
                    </div>
                    <span className={`font-bold font-mono ${tx.amount > 0 ? 'text-[#047857]' : 'text-[#131b2e]'}`}>
                      {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Store & Registry Quick Link */}
            {onOpenStore && (
              <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#dae2fd] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#e2e7ff] text-[#0051d5]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#131b2e]">Campus Store & Supplies</p>
                    <p className="text-[11px] text-[#757682]">Order course packets, lab kits & books</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenStore();
                  }}
                  className="px-3 py-1.5 bg-[#0051d5] text-white rounded-lg text-xs font-semibold hover:bg-[#00236f] transition-colors cursor-pointer"
                >
                  Order Items
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#e2e7ff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#444651] hover:text-[#131b2e] rounded-lg hover:bg-[#f2f3ff]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleTopUp}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#0051d5] hover:bg-[#00236f] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Add ${selectedAmount} via Apple Pay / Debit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
