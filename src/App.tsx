/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { PulseAIModal } from './components/PulseAIModal';
import { SubmitAssignmentModal } from './components/SubmitAssignmentModal';
import { StudyGuideModal } from './components/StudyGuideModal';
import { TimetableModal } from './components/TimetableModal';
import { ReservePodModal } from './components/ReservePodModal';
import { RsvpModal } from './components/RsvpModal';
import { CampusCardModal } from './components/CampusCardModal';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { StoreItemModal } from './components/StoreItemModal';
import { StudentRegistryModal } from './components/StudentRegistryModal';

import { OverviewView } from './views/OverviewView';
import { CoursesView } from './views/CoursesView';
import { DeadlinesView } from './views/DeadlinesView';
import { GradesView } from './views/GradesView';
import { NoticesView } from './views/NoticesView';
import { FacultyView } from './views/FacultyView';
import { LibraryView } from './views/LibraryView';
import { FacultyPortalView } from './views/FacultyPortalView';

import { UserRole } from './types/campus';

function AppContent() {
  const { toastMessage, showToast, cardBalance, addCardFunds, rsvpNoticeEvent } = useCampus();

  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPulseAIOpen, setIsPulseAIOpen] = useState(false);
  const [pulseInitialQuery, setPulseInitialQuery] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isStudyGuideOpen, setIsStudyGuideOpen] = useState(false);
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  const [isReservePodOpen, setIsReservePodOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isCampusCardOpen, setIsCampusCardOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isStudentRegistryOpen, setIsStudentRegistryOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<string | null>(null);

  const handleOpenPulseAIWithQuery = (query: string) => {
    setPulseInitialQuery(query);
    setIsPulseAIOpen(true);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'faculty') {
      showToast('Switched to Faculty Administrator Mode: Prof. Marcus Miller');
    } else {
      showToast('Switched to Undergraduate Student Mode: Alex Chen');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-[#dbe1ff] selection:text-[#00174b]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00236f] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 border border-[#e2e7ff]/20">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        termString="Spring 2025 • Term B"
      />

      {/* Main Website Wrapper */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* Global Website Header */}
        <Header
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenPulseAI={() => {
            setPulseInitialQuery('');
            setIsPulseAIOpen(true);
          }}
          onOpenNoticeTab={() => {
            setActiveTab('campus-notices');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenStudentRegistry={() => setIsStudentRegistryOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 pt-20 w-full min-h-screen">
          {currentRole === 'faculty' ? (
            <FacultyPortalView onSwitchToStudent={() => setCurrentRole('student')} />
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewView
                  onNavigate={(view) => {
                    setActiveTab(view as ActiveTab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                  onOpenStudyGuide={() => setIsStudyGuideOpen(true)}
                  onOpenTimetable={() => setIsTimetableOpen(true)}
                  onOpenReservePod={() => setIsReservePodOpen(true)}
                  onOpenRsvp={() => setIsRsvpOpen(true)}
                  onOpenCampusCard={() => setIsCampusCardOpen(true)}
                  onOpenStore={() => setIsStoreModalOpen(true)}
                  onOpenStudentRegistry={() => setIsStudentRegistryOpen(true)}
                  onOpenDocument={(doc) => setActiveDocument(doc)}
                  onAskPulseAI={handleOpenPulseAIWithQuery}
                  cardBalance={cardBalance}
                />
              )}

              {activeTab === 'courses' && (
                <CoursesView
                  onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                  onOpenStudyGuide={() => setIsStudyGuideOpen(true)}
                />
              )}

              {activeTab === 'deadlines' && (
                <DeadlinesView
                  onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                  onOpenStudyGuide={() => setIsStudyGuideOpen(true)}
                />
              )}

              {activeTab === 'grades' && <GradesView />}

              {activeTab === 'campus-notices' && (
                <NoticesView
                  onOpenDocument={(doc) => setActiveDocument(doc)}
                  onOpenRsvp={() => setIsRsvpOpen(true)}
                />
              )}

              {activeTab === 'faculty-directory' && <FacultyView />}

              {activeTab === 'library' && (
                <LibraryView onOpenReservePod={() => setIsReservePodOpen(true)} />
              )}
            </>
          )}
        </main>

        {/* Website Footer */}
        <Footer />
      </div>

      {/* Global Modals & Dialogs */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab as ActiveTab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <PulseAIModal
        isOpen={isPulseAIOpen}
        onClose={() => setIsPulseAIOpen(false)}
        initialQuery={pulseInitialQuery}
      />

      <SubmitAssignmentModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitSuccess={() => {
          showToast('CS 301 Raft Milestone 2 submitted! 20/20 Autograder Tests Passed.');
        }}
      />

      <StudyGuideModal
        isOpen={isStudyGuideOpen}
        onClose={() => setIsStudyGuideOpen(false)}
      />

      <TimetableModal
        isOpen={isTimetableOpen}
        onClose={() => setIsTimetableOpen(false)}
      />

      <ReservePodModal
        isOpen={isReservePodOpen}
        onClose={() => setIsReservePodOpen(false)}
        onReserved={(pod, slot) => {
          showToast(`Reserved ${pod} for ${slot}. Tap student card at scanner to unlock.`);
        }}
      />

      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        onRsvpSuccess={() => {
          rsvpNoticeEvent('notice-2');
          showToast('Keynote Seat Reserved! Ticket #AWS-CS-2025-042 generated.');
        }}
      />

      <CampusCardModal
        isOpen={isCampusCardOpen}
        onClose={() => setIsCampusCardOpen(false)}
        balance={cardBalance}
        onAddFunds={(amt) => {
          addCardFunds(amt);
        }}
        onOpenStore={() => setIsStoreModalOpen(true)}
      />

      <StoreItemModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />

      <StudentRegistryModal
        isOpen={isStudentRegistryOpen}
        onClose={() => setIsStudentRegistryOpen(false)}
      />

      <DocumentViewerModal
        isOpen={!!activeDocument}
        onClose={() => setActiveDocument(null)}
        documentName={activeDocument || ''}
      />
    </div>
  );
}

export default function App() {
  return (
    <CampusProvider>
      <AppContent />
    </CampusProvider>
  );
}
