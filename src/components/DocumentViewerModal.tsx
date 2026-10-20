import React from 'react';
import { X, FileText, Download, CheckCircle, ShieldCheck } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentName
}) => {
  if (!isOpen) return null;

  const isPdf = documentName.endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#e2e7ff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00236f] text-white flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#90a8ff]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0051d5]">Institutional Notice Attachment</span>
              <h3 className="font-bold text-sm text-[#131b2e]">{documentName}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#757682] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 rounded-lg bg-[#d1fae5]/50 border border-[#10b981]/30 flex items-center gap-2 text-xs text-[#047857]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Digital Cryptographic Signature Verified by Office of the Dean of Academic Affairs.</span>
          </div>

          {isPdf ? (
            <div className="space-y-4 text-xs text-[#444651]">
              <div className="border border-[#e2e7ff] rounded-xl p-4 bg-[#faf8ff] space-y-3 font-mono">
                <div className="text-center border-b border-[#dae2fd] pb-2 font-sans">
                  <h4 className="font-bold text-sm text-[#00236f]">SPRING 2025 MIDTERM ROOM ALLOTMENTS</h4>
                  <p className="text-[11px] text-[#757682]">Computer Science & Engineering • Junior Year Cohort</p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px] font-bold text-[#131b2e] border-b border-[#dae2fd] pb-1">
                  <span>Student ID</span>
                  <span>Full Name</span>
                  <span>Exam Venue</span>
                  <span>Assigned Desk</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px] bg-[#dbe1ff]/40 p-1.5 rounded font-bold text-[#00174b]">
                  <span>#984210</span>
                  <span>Alex Chen</span>
                  <span>Turing Arena B4</span>
                  <span>Desk B-42</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px] p-1.5">
                  <span>#984211</span>
                  <span>Maya Patel</span>
                  <span>Turing Arena B4</span>
                  <span>Desk B-43</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px] p-1.5">
                  <span>#984212</span>
                  <span>Liam O'Connor</span>
                  <span>Turing Arena B4</span>
                  <span>Desk B-44</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px] p-1.5">
                  <span>#984213</span>
                  <span>Sophia Zhang</span>
                  <span>Turing Arena B4</span>
                  <span>Desk B-45</span>
                </div>
              </div>
              <p className="text-[#757682]">
                * Examinees are required to present government or university photo ID. Invigilators will lock doors 10 minutes prior to exam commencement.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs text-[#444651]">
              <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fef3c7] text-[#92400e]">
                <h4 className="font-bold">Restricted Faculty / Proctor Roster</h4>
                <p className="mt-1">
                  Access granted for authorized proctoring staff. Contains extended time allotments (1.5x / 2.0x) under Academic Accommodation Directives.
                </p>
              </div>
              <div className="border border-[#e2e7ff] rounded-xl p-3 bg-white space-y-2">
                <p className="font-semibold text-xs text-[#131b2e]">Special Services Contact:</p>
                <p>Academic Accommodations Desk: accommodations@campus.edu • Ext. 4100</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#e2e7ff] flex items-center justify-between bg-[#faf8ff]">
          <span className="text-xs text-[#757682]">Verified Official Record</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Downloading verified institutional copy of ${documentName}`)}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#0051d5] text-white hover:bg-[#00236f] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download Official Copy
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-[#444651] hover:bg-[#eaedff] rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
