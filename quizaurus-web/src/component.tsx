import { useToolOutput } from "./hooks";
import { QuestionScreen, QuizState } from "./QuestionScreen";
import { ResultsScreen } from "./ResultsScreen";
import React, { useState } from "react";

export interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

// Type definitions
interface QuizData {
    topic: string;
    difficulty: string;
    questions: Question[];
}

function App() {
    const toolOutput = useToolOutput() as QuizData | null;

    // State management
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
    const [quizState, setQuizState] = useState<QuizState>("question");
    const [userAnswers, setUserAnswers] = useState<number[]>([]);

    if (!toolOutput) {
        return <div>Loading...</div>;
    }

    const currentQuestion = toolOutput.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === toolOutput.questions.length - 1;
    const correctAnswersCount = userAnswers.filter(
        (answer, idx) => answer === toolOutput.questions[idx].correctIndex
    ).length;
    const totalQuestions = toolOutput.questions.length;
    const mistakesCount = userAnswers.length - correctAnswersCount;

    // Event handlers
    const handleSelectAnswer = (index: number) => {
        if (quizState === "question") {
            setSelectedAnswerIndex(index);
        }
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswerIndex !== null) {
            setUserAnswers([...userAnswers, selectedAnswerIndex]);
            setQuizState("feedback");
        }
    };

    const handleNextQuestion = () => {
        if (isLastQuestion) {
            setQuizState("results");
        } else {
            setSelectedAnswerIndex(null);
            setQuizState("question");
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleStartOver = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setQuizState("question");
        setUserAnswers([]);
    };

    // Render Results Screen
    if (quizState === "results") {
        return (
            <ResultsScreen
                topic={toolOutput.topic}
                difficulty={toolOutput.difficulty}
                correctAnswersCount={correctAnswersCount}
                totalQuestions={totalQuestions}
                mistakesCount={mistakesCount}
                onStartOver={handleStartOver}
            />
        );
    }

    // Render Question or Feedback Screen
    return (
        <QuestionScreen
            topic={toolOutput.topic}
            difficulty={toolOutput.difficulty}
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            quizState={quizState}
            selectedAnswerIndex={selectedAnswerIndex}
            isLastQuestion={isLastQuestion}
            onSelectAnswer={handleSelectAnswer}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
        />
    );
}

export default App;
