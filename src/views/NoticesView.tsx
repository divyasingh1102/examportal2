import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { NoticeItem } from '../types/campus';
import { Search, Bell, Download, Calendar, MapPin, CheckCircle, ShieldCheck, CheckCheck, ExternalLink } from 'lucide-react';

interface NoticesViewProps {
  onOpenDocument: (name: string) => void;
  onOpenRsvp: () => void;
}

export const NoticesView: React.FC<NoticesViewProps> = ({ onOpenDocument, onOpenRsvp }) => {
  const { notices, readNoticeIds, markNoticeAsRead, markAllNoticesAsRead, showToast } = useCampus();

  const [activeTab, setActiveTab] = useState<'all' | 'exams' | 'departmental' | 'workshops' | 'bursar' | 'campus-life'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = notices.filter((n) => {
    const matchesTab = activeTab === 'all' || n.category === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.sender.toLowerCase().includes(q) ||
      n.targetCohort.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const unreadCount = notices.filter((n) => !readNoticeIds.includes(n.id)).length;

  return (
    <div className="px-4 sm:px-8 py-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#e2e7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] text-[11px] font-bold uppercase tracking-wider">
              Institutional Communiques
            </span>
            <span className="text-[11px] text-[#757682] font-semibold">
              {notices.length} Published • {unreadCount} Unread
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e]">Campus Bulletins & Notices</h1>
          <p className="text-sm text-[#444651] mt-1">
            Official communiques from Academic Affairs, Bursar, Computer Science Department, and Career Services.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {unreadCount > 0 && (
            <button
              onClick={markAllNoticesAsRead}
              className="px-3.5 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#0051d5] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#dae2fd] whitespace-nowrap cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#757682] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bulletins & communiques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] placeholder:text-[#757682] focus:outline-none border border-[#dae2fd]"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Notices (${notices.length})` },
          { id: 'exams', label: 'Exams & Timetables' },
          { id: 'departmental', label: 'CS Department' },
          { id: 'workshops', label: 'Keynotes & Workshops' },
          { id: 'bursar', label: 'Financial Aid / Bursar' },
          { id: 'campus-life', label: 'Campus Life & Facilities' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1e3a8a] text-white shadow-xs'
                : 'bg-white text-[#444651] hover:text-[#131b2e] border border-[#e2e7ff]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#e2e7ff] text-[#757682] text-xs">
            No notices match your search or filter.
          </div>
        ) : (
          filtered.map((notice) => {
            const isUnread = !readNoticeIds.includes(notice.id);

            return (
              <article
                key={notice.id}
                onClick={() => isUnread && markNoticeAsRead(notice.id)}
                className={`p-6 bg-white rounded-xl shadow-xs border transition-all flex flex-col gap-4 relative ${
                  isUnread ? 'border-[#0051d5]/40 ring-1 ring-[#0051d5]/20' : 'border-[#e2e7ff] hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00236f] text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {notice.senderShort}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#131b2e]">{notice.sender}</span>
                        <span className="material-symbols-outlined text-[16px] text-[#0051d5]">verified</span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#0051d5] inline-block animate-ping"></span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#757682]">{notice.publishedAgo}</span>
                        <span className="w-1 h-1 rounded-full bg-[#757682]"></span>
                        <span className="text-[11px] font-semibold text-[#0051d5]">{notice.targetCohort}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isUnread && (
                      <span className="px-2 py-0.5 rounded-full bg-[#0051d5] text-white text-[10px] font-bold uppercase tracking-wider">
                        New
                      </span>
                    )}
                    {notice.badge && (
                      <span className="px-2.5 py-1 rounded-full bg-[#dbe1ff] text-[#00174b] text-[11px] font-bold uppercase tracking-wider">
                        {notice.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pl-0 md:pl-13 space-y-3">
                  <h3 className="text-lg font-bold text-[#131b2e]">{notice.title}</h3>
                  <p className="text-sm text-[#444651] leading-relaxed">{notice.summary}</p>

                  {/* Event Metadata */}
                  {notice.eventMeta && (
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#f2f3ff] border border-[#dae2fd]">
                      <div className="flex items-center gap-4 flex-wrap text-xs text-[#444651]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#0051d5]" />
                          <span className="font-semibold">{notice.eventMeta.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#0051d5]" />
                          <span className="font-semibold">{notice.eventMeta.location}</span>
                        </div>
                      </div>

                      {notice.eventMeta.spotsLeft !== undefined && (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#b45309] bg-[#fffbeb] px-2 py-0.5 rounded">
                            {notice.eventMeta.spotsLeft} spots left
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenRsvp();
                            }}
                            className="px-4 py-1.5 rounded-lg bg-[#0051d5] text-white hover:bg-[#00236f] text-xs font-semibold shadow-xs cursor-pointer"
                          >
                            RSVP Ticket
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Attached Documents */}
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {notice.attachments.map((att) => (
                        <div
                          key={att.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDocument(att.name);
                          }}
                          className="inline-flex items-center gap-3 p-2.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors cursor-pointer border border-[#dae2fd]"
                        >
                          <div className="p-2 rounded bg-white text-[#ba1a1a]">
                            <span className="material-symbols-outlined text-[18px]">
                              {att.type === 'pdf' ? 'picture_as_pdf' : 'table_chart'}
                            </span>
                          </div>
                          <div className="flex flex-col pr-2">
                            <span className="text-xs font-semibold text-[#131b2e]">{att.name}</span>
                            <span className="text-[11px] text-[#757682]">{att.size}</span>
                          </div>
                          <Download className="w-4 h-4 text-[#757682]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* External Link */}
                  {notice.externalLink && (
                    <div className="pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Opened institutional gateway: ${notice.externalLink?.text}`);
                        }}
                        className="text-xs font-semibold text-[#0051d5] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {notice.externalLink.text}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
