import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Monitor, Zap, MapPin } from 'lucide-react';
import { mockLibraryPods } from '../data/mockData';

interface ReservePodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReserved: (podName: string, slot: string) => void;
}

export const ReservePodModal: React.FC<ReservePodModalProps> = ({ isOpen, onClose, onReserved }) => {
  const [selectedPod, setSelectedPod] = useState(mockLibraryPods[0].id);
  const [selectedDuration, setSelectedDuration] = useState('2');
  const [timeSlot, setTimeSlot] = useState('12:00 PM - 2:00 PM');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const pod = mockLibraryPods.find(p => p.id === selectedPod);
    setConfirmed(true);
    setTimeout(() => {
      onReserved(pod?.name || 'Focus Pod 301', timeSlot);
      onClose();
      setConfirmed(false);
    }, 1200);
  };

  const currentPod = mockLibraryPods.find(p => p.id === selectedPod);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e2e7ff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0051d5] text-white flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0051d5]">Main Library • Turing Wing</span>
              <h3 className="font-bold text-base text-[#131b2e]">Reserve Private Study Pod</h3>
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
            <h4 className="text-lg font-bold text-[#131b2e]">Pod Reservation Confirmed!</h4>
            <p className="text-xs text-[#444651] max-w-sm">
              Your reservation for <strong>{currentPod?.name}</strong> ({timeSlot}) is saved. Tap your physical or digital Campus Card at the pod scanner to unlock.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#757682] mb-2">
                Available Focus Pods & GPU Stations (Floor 3)
              </label>
              <div className="grid grid-cols-2 gap-2.5 max-h-52 overflow-y-auto p-1">
                {mockLibraryPods.map((pod) => (
                  <button
                    key={pod.id}
                    disabled={pod.status === 'occupied'}
                    onClick={() => setSelectedPod(pod.id)}
                    type="button"
                    className={`p-3 rounded-xl text-left border transition-all ${
                      selectedPod === pod.id
                        ? 'border-[#0051d5] bg-[#dbe1ff]/30 ring-2 ring-[#0051d5]/20'
                        : pod.status === 'occupied'
                        ? 'border-[#e2e7ff] bg-[#f2f3ff]/50 opacity-50 cursor-not-allowed'
                        : 'border-[#e2e7ff] bg-white hover:border-[#dae2fd]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#131b2e]">{pod.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        pod.status === 'available' ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}>
                        {pod.status === 'available' ? 'Free' : 'Busy'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#444651] mt-1">{pod.floor}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-[#757682]">
                      {pod.hasMonitor && (
                        <span className="flex items-center gap-0.5"><Monitor className="w-3 h-3" /> Monitor</span>
                      )}
                      {pod.powerOutlet && (
                        <span className="flex items-center gap-0.5"><Zap className="w-3 h-3" /> Power</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">Duration</label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-[#dae2fd] bg-[#faf8ff] text-[#131b2e] focus:outline-none"
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours (Standard)</option>
                  <option value="3">3 Hours (Max)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">Starting Time</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-[#dae2fd] bg-[#faf8ff] text-[#131b2e] focus:outline-none"
                >
                  <option value="12:00 PM - 2:00 PM">12:00 PM Today</option>
                  <option value="02:00 PM - 4:00 PM">02:00 PM Today</option>
                  <option value="04:30 PM - 6:30 PM">04:30 PM Today</option>
                  <option value="07:00 PM - 9:00 PM">07:00 PM Tonight</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#f2f3ff] text-xs text-[#444651] flex items-center justify-between">
              <span>Quiet Zone Policy: Headphones required at all times.</span>
              <span className="font-semibold text-[#0051d5]">No fee</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#e2e7ff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#444651] hover:text-[#131b2e] rounded-lg hover:bg-[#f2f3ff]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#0051d5] hover:bg-[#00236f] rounded-lg shadow-xs transition-colors"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
