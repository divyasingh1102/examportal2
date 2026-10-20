import React, { useState } from 'react';
import { mockLibraryPods } from '../data/mockData';
import { BookOpen, Clock, Printer, Zap, Monitor, MapPin, CheckCircle2 } from 'lucide-react';

interface LibraryViewProps {
  onOpenReservePod: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onOpenReservePod }) => {
  const [printQuota, setPrintQuota] = useState(120);

  return (
    <div className="px-4 sm:px-8 py-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Top Banner with Background */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm relative min-h-[220px] flex items-end p-6 sm:p-8 border border-[#e2e7ff]"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(19, 27, 46, 0.95), rgba(19, 27, 46, 0.4)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJFO2eQ68QhjjCQSqshJbTu4RJhKaLXYv6Bu3NQTzwBqmN0ywBWE4boFfqzgB4BMjnB6Pa3cNT04KaEYUjcb7-uOofimWWBmVPwp8yIycRVkS3-bp4OM6z9bJxd7xBDydKLLIRbdquzpXOe-WVDa1G3RESE5drzRcnmOZaUAowNO3Xm_d_g5p_H7J1DS35ZQox2Ru6ZkqdMAG5IBRRClVgqXdxsPKJNlsDEZ2eLGk69xyZO9pqQb4w')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full gap-4 text-white">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0051d5] text-white text-[11px] font-bold uppercase tracking-wider">
                Open 24/7 • High Security
              </span>
              <span className="text-[11px] text-[#dce1ff] font-semibold">Turing Wing Acoustic Silent Zone</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Main University Library & Study Spaces</h1>
            <p className="text-xs sm:text-sm text-[#b6c4ff] mt-1 max-w-xl">
              Equipped with 14 soundproof focus pods, dual 4K display stations, and high-performance GPU workstations.
            </p>
          </div>

          <button
            onClick={onOpenReservePod}
            className="px-5 py-2.5 rounded-xl bg-[#0051d5] text-white font-semibold text-xs hover:bg-[#00236f] transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Reserve Focus Pod Now
          </button>
        </div>
      </div>

      {/* Real-time Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-[#757682]">Floor 3 Silent Zone</span>
            <p className="text-2xl font-extrabold text-[#131b2e] mt-1">42% Occupied</p>
            <p className="text-xs text-[#047857] font-semibold">Low noise level (32 dB)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#d1fae5] text-[#047857] flex items-center justify-center font-bold text-sm">
            QUIET
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-[#757682]">Available Focus Pods</span>
            <p className="text-2xl font-extrabold text-[#131b2e] mt-1">14 / 20 Free</p>
            <p className="text-xs text-[#0051d5] font-semibold">Instant tap-to-enter</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#dbe1ff] text-[#00174b] flex items-center justify-center">
            <Monitor className="w-6 h-6 text-[#0051d5]" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#e2e7ff] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-[#757682]">Student Print Quota</span>
            <p className="text-2xl font-extrabold text-[#131b2e] mt-1">{printQuota} Pages</p>
            <p className="text-xs text-[#757682]">Resets on April 1st</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#f2f3ff] text-[#444651] flex items-center justify-center">
            <Printer className="w-6 h-6 text-[#0051d5]" />
          </div>
        </div>
      </div>

      {/* Pods Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#e2e7ff] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#131b2e]">Floor 3 Pod & Workstation Availability</h2>
            <p className="text-xs text-[#757682]">Monitored via IoT motion sensors and door contact relays</p>
          </div>
          <button
            onClick={onOpenReservePod}
            className="text-xs text-[#0051d5] font-semibold hover:underline"
          >
            View Reservation Rules →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockLibraryPods.map(pod => (
            <div
              key={pod.id}
              className={`p-4 rounded-xl border transition-all ${
                pod.status === 'available'
                  ? 'border-[#e2e7ff] bg-white hover:border-[#dae2fd]'
                  : 'border-[#f2f3ff] bg-[#faf8ff] opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#131b2e]">{pod.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  pod.status === 'available' ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                }`}>
                  {pod.status === 'available' ? 'Available' : `In Use until ${pod.until}`}
                </span>
              </div>
              <p className="text-xs text-[#444651]">{pod.floor}</p>
              {pod.gpu && (
                <span className="inline-block mt-2 text-[10px] font-mono font-bold bg-[#eaedff] text-[#00236f] px-2 py-0.5 rounded">
                  {pod.gpu}
                </span>
              )}

              <div className="mt-4 pt-3 border-t border-[#f2f3ff] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-[#757682] text-[11px]">
                  {pod.hasMonitor && <span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5 text-[#0051d5]" /> Dual Display</span>}
                  {pod.powerOutlet && <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-[#0051d5]" /> 100W PD</span>}
                </div>
                {pod.status === 'available' && (
                  <button
                    onClick={onOpenReservePod}
                    className="text-xs font-bold text-[#0051d5] hover:underline"
                  >
                    Reserve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
