import React from "react";
import { Question } from "./component";

export type QuizState = "question" | "feedback" | "results";

interface QuestionScreenProps {
    topic: string;
    difficulty: string;
    currentQuestion: Question;
    currentQuestionIndex: number;
    totalQuestions: number;
    quizState: QuizState;
    selectedAnswerIndex: number | null;
    isLastQuestion: boolean;
    onSelectAnswer: (index: number) => void;
    onSubmitAnswer: () => void;
    onNextQuestion: () => void;
}

export function QuestionScreen({
    topic,
    difficulty,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    quizState,
    selectedAnswerIndex,
    isLastQuestion,
    onSelectAnswer,
    onSubmitAnswer,
    onNextQuestion,
}: QuestionScreenProps) {
    const isCorrect = selectedAnswerIndex === currentQuestion.correctIndex;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.topicBadge}>
                        {topic} - {difficulty}
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
                                onClick={() => onSelectAnswer(index)}
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
                        onClick={onSubmitAnswer}
                        disabled={selectedAnswerIndex === null}
                    >
                        Submit Answer
                    </button>
                ) : (
                    <button style={styles.primaryButton} onClick={onNextQuestion}>
                        {isLastQuestion ? "See Results" : "Next Question"}
                    </button>
                )}
            </div>
        </div>
    );
}

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
};
