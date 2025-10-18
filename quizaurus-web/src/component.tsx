import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { useToolOutput } from "./hooks";

// Type definitions
interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface QuizData {
    topic: string;
    difficulty: string;
    questions: Question[];
}

type QuizState = "question" | "feedback" | "results";

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
        const scorePercentage = Math.round((correctAnswersCount / totalQuestions) * 100);

        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Quiz Complete!</h1>
                    <div style={styles.topicBadge}>
                        {toolOutput.topic} - {toolOutput.difficulty}
                    </div>

                    <div style={styles.resultsContainer}>
                        <div style={styles.scoreCircle}>
                            <span style={styles.scorePercentage}>{scorePercentage}%</span>
                        </div>

                        <div style={styles.resultsStats}>
                            <div style={styles.statItem}>
                                <span style={styles.statLabel}>Correct Answers:</span>
                                <span style={styles.statValue}>{correctAnswersCount} out of {totalQuestions}</span>
                            </div>
                            <div style={styles.statItem}>
                                <span style={styles.statLabel}>Mistakes:</span>
                                <span style={styles.statValue}>{mistakesCount}</span>
                            </div>
                        </div>
                    </div>

                    <button style={styles.primaryButton} onClick={handleStartOver}>
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    // Render Question or Feedback Screen
    const isCorrect = selectedAnswerIndex === currentQuestion.correctIndex;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.topicBadge}>
                        {toolOutput.topic} - {toolOutput.difficulty}
                    </div>
                    <div style={styles.questionCounter}>
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </div>
                </div>

                <div style={styles.progressBar}>
                    <div
                        style={{
                            ...styles.progressFill,
                            width: `${((currentQuestionIndex + (quizState === "feedback" ? 1 : 0)) / totalQuestions) * 100}%`
                        }}
                    />
                </div>

                <h2 style={styles.questionText}>{currentQuestion.question}</h2>

                <div style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => {
                        let optionStyle = styles.option;

                        if (quizState === "feedback") {
                            if (index === currentQuestion.correctIndex) {
                                optionStyle = { ...styles.option, ...styles.optionCorrect };
                            } else if (index === selectedAnswerIndex && !isCorrect) {
                                optionStyle = { ...styles.option, ...styles.optionIncorrect };
                            }
                        } else if (index === selectedAnswerIndex) {
                            optionStyle = { ...styles.option, ...styles.optionSelected };
                        }

                        return (
                            <button
                                key={index}
                                style={optionStyle}
                                onClick={() => handleSelectAnswer(index)}
                                disabled={quizState === "feedback"}
                            >
                                <span style={styles.optionLetter}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span style={styles.optionText}>{option}</span>
                            </button>
                        );
                    })}
                </div>

                <div style={{
                    ...styles.explanation,
                    ...(quizState === "feedback" && (isCorrect ? styles.explanationCorrect : styles.explanationIncorrect)),
                    visibility: quizState === "feedback" ? "visible" : "hidden",
                }}>
                    <strong>{isCorrect ? "✓ Correct! " : "✗ Incorrect. "}</strong>
                    {currentQuestion.explanation}
                </div>

                {quizState === "question" ? (
                    <button
                        style={selectedAnswerIndex === null ? styles.disabledButton : styles.primaryButton}
                        onClick={handleSubmitAnswer}
                        disabled={selectedAnswerIndex === null}
                    >
                        Submit Answer
                    </button>
                ) : (
                    <button style={styles.primaryButton} onClick={handleNextQuestion}>
                        {isLastQuestion ? "See Results" : "Next Question"}
                    </button>
                )}
            </div>
        </div>
    );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    },
    card: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        maxWidth: "650px",
        width: "100%",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
        flexWrap: "wrap",
        gap: "8px",
    },
    topicBadge: {
        backgroundColor: "#e3f2fd",
        color: "#1976d2",
        padding: "6px 12px",
        borderRadius: "16px",
        fontSize: "13px",
        fontWeight: 600,
        textTransform: "capitalize",
    },
    questionCounter: {
        color: "#666",
        fontSize: "13px",
        fontWeight: 500,
    },
    progressBar: {
        height: "6px",
        backgroundColor: "#e0e0e0",
        borderRadius: "3px",
        overflow: "hidden",
        marginBottom: "16px",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#1976d2",
        transition: "width 0.3s ease",
    },
    questionText: {
        fontSize: "20px",
        fontWeight: 600,
        color: "#333",
        marginBottom: "16px",
        lineHeight: "1.4",
    },
    optionsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "10px",
        marginBottom: "16px",
        flex: 1,
    },
    option: {
        display: "flex",
        alignItems: "center",
        padding: "12px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "white",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontSize: "15px",
        textAlign: "left",
    },
    optionSelected: {
        border: "2px solid #1976d2",
        backgroundColor: "#e3f2fd",
    },
    optionCorrect: {
        border: "2px solid #4caf50",
        backgroundColor: "#e8f5e9",
    },
    optionIncorrect: {
        border: "2px solid #f44336",
        backgroundColor: "#ffebee",
    },
    optionLetter: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        backgroundColor: "#f5f5f5",
        fontWeight: 700,
        marginRight: "10px",
        flexShrink: 0,
        fontSize: "13px",
    },
    optionText: {
        flex: 1,
    },
    explanation: {
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "16px",
        lineHeight: "1.5",
        fontSize: "14px",
        minHeight: "80px",
        backgroundColor: "#f5f5f5",
        color: "#555",
    },
    explanationCorrect: {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
    },
    explanationIncorrect: {
        backgroundColor: "#ffebee",
        color: "#c62828",
    },
    primaryButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        marginTop: "auto",
    },
    disabledButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#bdbdbd",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: 600,
        cursor: "not-allowed",
        marginTop: "auto",
    },
    title: {
        fontSize: "32px",
        fontWeight: 700,
        color: "#333",
        marginBottom: "24px",
        textAlign: "center",
    },
    resultsContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        marginBottom: "32px",
    },
    scoreCircle: {
        width: "160px",
        height: "160px",
        borderRadius: "50%",
        backgroundColor: "#e3f2fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "8px solid #1976d2",
    },
    scorePercentage: {
        fontSize: "48px",
        fontWeight: 700,
        color: "#1976d2",
    },
    resultsStats: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    statItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
    },
    statLabel: {
        fontWeight: 600,
        color: "#666",
    },
    statValue: {
        fontWeight: 700,
        color: "#333",
        fontSize: "18px",
    },
}

export default App;
