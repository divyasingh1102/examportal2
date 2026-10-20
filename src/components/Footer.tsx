import React from 'react';
import { ShieldCheck, PhoneCall, HelpCircle, BookOpen, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-white border-t border-[#e2e7ff] text-[#444651] text-xs">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/campuspulse-logo.svg"
                alt="CampusPulse"
                className="h-6 w-auto"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/campuspulse-logo.png';
                }}
              />
              <span className="font-bold text-sm text-[#00236f]">CampusPulse</span>
            </div>
            <p className="text-xs text-[#757682] leading-relaxed">
              Official university academic intelligence and student registry platform. Providing real-time course analytics, verified communiques, and student services.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#0051d5] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span>FERPA & Institutional Privacy Compliant</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#131b2e]">Academic Services</h5>
            <ul className="space-y-1.5 text-xs text-[#757682]">
              <li><a href="#" className="hover:text-[#0051d5] transition-colors">Undergraduate Degree Audit</a></li>
              <li><a href="#" className="hover:text-[#0051d5] transition-colors">Official Transcript Orders</a></li>
              <li><a href="#" className="hover:text-[#0051d5] transition-colors">Course Catalog & Add/Drop Dates</a></li>
              <li><a href="#" className="hover:text-[#0051d5] transition-colors">Final Examination Protocols</a></li>
              <li><a href="#" className="hover:text-[#0051d5] transition-colors">Special Academic Accommodations</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#131b2e]">Campus Resources</h5>
            <ul className="space-y-1.5 text-xs text-[#757682]">
              <li><a href="#" className="hover:text-[#0051d5] transition-colors">Main Library (Turing Wing 24/7)</a></li>
              <li><a href="#" className="hover:text-[#0051d5] transition-colors">Computer Science Hardware Labs</a></li>
              <li><a href="#" className="hover:text-[#0051d5] transition-colors">Bursar & Student Financial Services</a></li>
              <li><a href="#" className="hover:text-[#0051d5] transition-colors">Campus Dining & Meal Plans</a></li>
              <li><a href="#" className="hover:text-[#0051d5] transition-colors">Health & Counseling Services</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#131b2e]">Emergency & Assistance</h5>
            <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#e2e7ff] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ba1a1a]">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Campus Police & Safety: 911 / (555) 019-4911</span>
              </div>
              <p className="text-[11px] text-[#757682]">IT Helpdesk: helpdesk@campus.edu (Ext. 4357)</p>
              <p className="text-[11px] text-[#757682]">Dean of Academic Affairs: dean.academics@campus.edu</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#f2f3ff] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#757682]">
          <p>© 2025 CampusPulse University Academic Registry. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#0051d5] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#0051d5] transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-[#0051d5] transition-colors">Accessibility Standards</a>
            <span>•</span>
            <a href="#" className="hover:text-[#0051d5] transition-colors">Security Incident Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
