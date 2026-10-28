import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingView } from './views/LandingView';
import { AuthView } from './views/AuthView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { ExamInterfaceView } from './views/ExamInterfaceView';
import { ResultView } from './views/ResultView';
import { AdminDashboardView } from './views/AdminDashboardView';

const MainApp: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeExamId, setActiveExamId] = useState<number | null>(null);
  const [activeAttemptId, setActiveAttemptId] = useState<number | null>(null);

  const handleStartExam = (examId: number) => {
    setActiveExamId(examId);
    setCurrentView('exam-interface');
  };

  const handleFinishExam = (attemptId: number) => {
    setActiveAttemptId(attemptId);
    setCurrentView('result');
  };

  const handleViewResult = (attemptId: number) => {
    setActiveAttemptId(attemptId);
    setCurrentView('result');
  };

  const handleRetakeExam = () => {
    setCurrentView('student-dashboard');
  };

  const handleInspectAttempt = (attemptId: number) => {
    setActiveAttemptId(attemptId);
    setCurrentView('result');
  };

  const isExamInterface = currentView === 'exam-interface';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navbar is hidden during the active distraction-free examination */}
      {!isExamInterface && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'student-dashboard' && !user) {
              setCurrentView('auth');
            } else if (view === 'admin-dashboard' && (!user || !isAdmin)) {
              setCurrentView('auth');
            } else {
              setCurrentView(view);
            }
          }}
        />
      )}

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            onNavigate={(view) => setCurrentView(view)}
            onSelectExam={handleStartExam}
          />
        )}

        {currentView === 'auth' && (
          <AuthView onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'student-dashboard' && (
          <StudentDashboardView
            onStartExam={handleStartExam}
            onViewResult={handleViewResult}
          />
        )}

        {currentView === 'exam-interface' && activeExamId && (
          <ExamInterfaceView
            examId={activeExamId}
            onFinishExam={handleFinishExam}
          />
        )}

        {currentView === 'result' && activeAttemptId && (
          <ResultView
            attemptId={activeAttemptId}
            onBackToDashboard={() => setCurrentView(isAdmin ? 'admin-dashboard' : 'student-dashboard')}
            onRetakeExam={handleRetakeExam}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardView onInspectAttempt={handleInspectAttempt} />
        )}
      </div>

      {/* Footer is hidden during active exam */}
      {!isExamInterface && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
