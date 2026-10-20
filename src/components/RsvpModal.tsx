import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, MapPin, QrCode, Ticket } from 'lucide-react';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRsvpSuccess: () => void;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({ isOpen, onClose, onRsvpSuccess }) => {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleRsvp = () => {
    setConfirmed(true);
    setTimeout(() => {
      onRsvpSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#e2e7ff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0051d5] text-white flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0051d5]">Distinguished Keynote</span>
              <h3 className="font-bold text-base text-[#131b2e]">Marcus Vance: Distributed Systems</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#757682] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmed ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#131b2e]">Seat Confirmed & Ticket Issued!</h4>
            <div className="p-4 rounded-xl border border-[#dae2fd] bg-[#faf8ff] flex flex-col items-center gap-2">
              <QrCode className="w-24 h-24 text-[#00236f]" />
              <p className="font-mono text-xs font-bold text-[#00236f]">TICKET #AWS-CS-2025-042</p>
              <p className="text-[11px] text-[#444651]">Attendee: Alex Chen • Seat: Ada Lovelace Aud. Row D-14</p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 text-xs font-semibold text-white bg-[#0051d5] rounded-lg"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-[#f2f3ff] space-y-2">
              <h4 className="font-bold text-sm text-[#131b2e]">
                Designing Distributed Fault-Tolerant Architectures at Planetary Scale
              </h4>
              <p className="text-xs text-[#444651]">
                Marcus Vance, Principal Solutions Architect at AWS Cloud Infrastructure
              </p>
              <div className="pt-2 flex flex-col gap-1 text-xs text-[#444651]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0051d5]" />
                  <span>Thursday, March 20 • 4:00 PM - 5:30 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0051d5]" />
                  <span>Ada Lovelace Auditorium (Room 101)</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-[#dae2fd] flex items-center justify-between text-xs">
              <span className="text-[#444651]">Capacity Status:</span>
              <span className="font-bold text-[#b45309] bg-[#fffbeb] px-2 py-0.5 rounded">42 spots left</span>
            </div>

            <p className="text-xs text-[#757682]">
              Free entry for enrolled CS undergraduates and faculty. Refreshments and networking reception follow the Q&A.
            </p>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#e2e7ff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#444651] hover:text-[#131b2e] rounded-lg hover:bg-[#f2f3ff]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRsvp}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#0051d5] hover:bg-[#00236f] rounded-lg shadow-xs transition-colors"
              >
                Reserve Free Student Pass
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
