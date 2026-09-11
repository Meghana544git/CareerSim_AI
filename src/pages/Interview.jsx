import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import InterviewQuestion from '../components/InterviewQuestion';

export default function Interview({
  role,
  questions = [],
  currentQuestionIndex,
  answers = {},
  onChangeAnswer,
  onPreviousQuestion,
  onNextQuestion,
  onSubmitAnswer,
  onCompleteInterview
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!role || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-slate-500">Loading interview session...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === questions.length - 1;
  const currentAnswer = answers[currentQuestion.id] || '';

  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (onSubmitAnswer) {
        await onSubmitAnswer(currentQuestion, currentAnswer, isLast);
      } else if (isLast) {
        onCompleteInterview();
      } else {
        onNextQuestion();
      }
    } catch (err) {
      console.error('[CareerSim] Error evaluating answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 bg-mesh-pattern">
      {/* Top Progress Track */}
      <ProgressBar
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        roleTitle={role.title}
      />

      {/* Main Single Question Assessment Card */}
      <InterviewQuestion
        key={currentQuestion.id}
        question={currentQuestion}
        answer={currentAnswer}
        onChangeAnswer={(text) => onChangeAnswer(currentQuestion.id, text)}
        onPrevious={onPreviousQuestion}
        onSubmit={handleSubmitAnswer}
        isFirst={isFirst}
        isLast={isLast}
        isSubmitting={isSubmitting}
        totalQuestions={questions.length}
      />
    </div>
  );
}
