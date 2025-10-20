import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useToolOutput } from "./openAiHooks";
import { QuestionScreen } from "./QuestionScreen";
import { ResultsScreen } from "./ResultsScreen";

export interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export type QuizState = "question" | "feedback" | "results";

interface QuizData {
    topic: string;
    difficulty: string;
    questions: Question[];
}

function App() {
    const toolOutput = useToolOutput() as QuizData | null;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
    const [quizState, setQuizState] = useState<QuizState>("question");
    const [userAnswers, setUserAnswers] = useState<number[]>([]);

    if (!toolOutput) {
        return (
            <div className="quiz-container">
                <div className="quiz-card quiz-card--loading">
                    <div className="quiz-loading">
                        <div className="quiz-loading__spinner"></div>
                        <p className="quiz-loading__text">Generating your quiz...</p>
                    </div>
                </div>
            </div>
        );
    }

    const { questions, topic, difficulty } = toolOutput;
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const correctAnswersCount = userAnswers.filter(
        (answer, idx) => answer === questions[idx].correctIndex
    ).length;
    const mistakesCount = userAnswers.length - correctAnswersCount;

    const handleSubmitAnswer = (index: number) => {
        if (quizState === "question") {
            setSelectedAnswerIndex(index);
            setUserAnswers([...userAnswers, index]);
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

    if (quizState === "results") {
        return (
            <ResultsScreen
                topic={topic}
                difficulty={difficulty}
                correctAnswersCount={correctAnswersCount}
                totalQuestions={totalQuestions}
                mistakesCount={mistakesCount}
                onStartOver={handleStartOver}
            />
        );
    }

    return (
        <QuestionScreen
            topic={topic}
            difficulty={difficulty}
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            quizState={quizState}
            selectedAnswerIndex={selectedAnswerIndex}
            isLastQuestion={isLastQuestion}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
        />
    );
}

createRoot(document.getElementById("quizaurus-root")!).render(<App />);
