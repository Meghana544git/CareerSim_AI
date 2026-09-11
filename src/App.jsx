import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HistoryModal from './components/HistoryModal';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Results from './pages/Results';
import { ROLES, getRoleById } from './data/roles';
import { getQuestionsForRole } from './data/questions';
import { evaluateInterview } from './utils/evaluation';
import { evaluateAnswerAsync } from './services/evaluationService';
import {
  saveActiveSession,
  loadActiveSession,
  clearActiveSession,
  getAssessmentHistory,
  saveAssessmentToHistory,
  clearAssessmentHistory,
  getRoadmapProgress,
  toggleRoadmapItemProgress
} from './utils/storage';

export default function App() {
  // Session states with defensive hydration
  const [screen, setScreen] = useState('home'); // 'home' | 'interview' | 'results'
  const [selectedRoleId, setSelectedRoleId] = useState('frontend-developer');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);

  // History and roadmap state
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [roadmapProgress, setRoadmapProgress] = useState({});

  // 1. Initial State Hydration (Passes Stress Test 2: Refresh persistence)
  useEffect(() => {
    try {
      // Load History & Roadmap
      setHistory(getAssessmentHistory());
      setRoadmapProgress(getRoadmapProgress());

      // Hydrate Active Session
      const savedSession = loadActiveSession();
      if (savedSession) {
        if (savedSession.roleId && getRoleById(savedSession.roleId)) {
          setSelectedRoleId(savedSession.roleId);
        }
        if (typeof savedSession.currentQuestionIndex === 'number') {
          setCurrentQuestionIndex(Math.max(0, Math.min(4, savedSession.currentQuestionIndex)));
        }
        if (savedSession.answers && typeof savedSession.answers === 'object') {
          setAnswers(savedSession.answers);
        }
        if (savedSession.evaluations && typeof savedSession.evaluations === 'object') {
          setEvaluations(savedSession.evaluations);
        }
        if (savedSession.assessmentResult) {
          setAssessmentResult(savedSession.assessmentResult);
        }
        if (savedSession.screen && ['home', 'interview', 'results'].includes(savedSession.screen)) {
          setScreen(savedSession.screen);
        }
      }
    } catch (err) {
      console.error('[CareerSim] State hydration failed, resetting to defaults:', err);
      clearActiveSession();
      setScreen('home');
    }
  }, []);

  // 2. Continuous Session Persistence on State Change
  useEffect(() => {
    saveActiveSession({
      screen,
      roleId: selectedRoleId,
      currentQuestionIndex,
      answers,
      evaluations,
      assessmentResult
    });
  }, [screen, selectedRoleId, currentQuestionIndex, answers, evaluations, assessmentResult]);

  // Active role and question list
  const activeRole = getRoleById(selectedRoleId) || ROLES[0];
  const questions = getQuestionsForRole(selectedRoleId);

  // Handlers
  const handleSelectRole = (roleId) => {
    setSelectedRoleId(roleId);
  };

  const handleStartSimulation = (roleId) => {
    const targetRoleId = roleId || selectedRoleId;
    setSelectedRoleId(targetRoleId);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setEvaluations({});
    setAssessmentResult(null);
    setScreen('interview');
  };

  const handleChangeAnswer = (questionId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text
    }));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
  };

  // Evaluates an individual question answer asynchronously and advances or finishes
  const handleSubmitAnswerAsync = async (question, answerText, isLast) => {
    const evalResult = await evaluateAnswerAsync({
      role: activeRole,
      question,
      answer: answerText
    });

    const updatedEvaluations = {
      ...evaluations,
      [question.id]: evalResult
    };
    setEvaluations(updatedEvaluations);

    if (isLast) {
      const finalResult = evaluateInterview(activeRole, questions, answers, updatedEvaluations);
      setAssessmentResult(finalResult);

      const updatedHistory = saveAssessmentToHistory(finalResult);
      setHistory(updatedHistory);

      setScreen('results');
    } else {
      setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
    }
  };

  const handleCompleteInterview = () => {
    const result = evaluateInterview(activeRole, questions, answers, evaluations);
    setAssessmentResult(result);

    const updatedHistory = saveAssessmentToHistory(result);
    setHistory(updatedHistory);

    setScreen('results');
  };

  const handleRetakeInterview = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setEvaluations({});
    setAssessmentResult(null);
    setScreen('interview');
  };

  const handleSelectAnotherRole = () => {
    setScreen('home');
  };

  const handleResetSession = () => {
    if (screen === 'interview' && Object.keys(answers).length > 0) {
      const confirmReset = window.confirm(
        'Are you sure you want to exit your active interview simulation? Your in-progress answers will be reset.'
      );
      if (!confirmReset) return;
    }
    clearActiveSession();
    setCurrentQuestionIndex(0);
    setAnswers({});
    setEvaluations({});
    setAssessmentResult(null);
    setScreen('home');
  };

  const handleToggleRoadmapItem = (stepId) => {
    const updated = toggleRoadmapItemProgress(stepId);
    setRoadmapProgress(updated);
  };

  const handleClearHistory = () => {
    const confirmClear = window.confirm('Are you sure you want to clear your saved assessment history?');
    if (confirmClear) {
      clearAssessmentHistory();
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Universal Responsive Header */}
      <Header
        activeScreen={screen}
        activeRole={screen !== 'home' ? activeRole : null}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onResetSession={handleResetSession}
        onNavigateHome={() => setScreen('home')}
      />

      {/* Main View Port */}
      <main className="flex-1">
        {screen === 'home' && (
          <Home
            selectedRoleId={selectedRoleId}
            onSelectRole={handleSelectRole}
            onStartSimulation={handleStartSimulation}
          />
        )}

        {screen === 'interview' && (
          <Interview
            role={activeRole}
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onChangeAnswer={handleChangeAnswer}
            onPreviousQuestion={handlePreviousQuestion}
            onNextQuestion={handleNextQuestion}
            onSubmitAnswer={handleSubmitAnswerAsync}
            onCompleteInterview={handleCompleteInterview}
          />
        )}

        {screen === 'results' && (
          <Results
            assessmentResult={assessmentResult}
            roadmapProgress={roadmapProgress}
            onToggleRoadmapItem={handleToggleRoadmapItem}
            onRetakeInterview={handleRetakeInterview}
            onSelectAnotherRole={handleSelectAnotherRole}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        )}
      </main>

      {/* Assessment History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectRole={() => {
          setIsHistoryOpen(false);
          setScreen('home');
        }}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CareerSim AI • Round 1 Frontend Hackathon Submission</span>
          <span className="text-slate-400">
            Deterministic Evaluation • 100% Client-Side • Zero External API Dependencies
          </span>
        </div>
      </footer>
    </div>
  );
}
