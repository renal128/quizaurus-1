import React from "react";

interface ResultsScreenProps {
    topic: string;
    difficulty: string;
    correctAnswersCount: number;
    totalQuestions: number;
    mistakesCount: number;
    onStartOver: () => void;
}

export function ResultsScreen({ topic, difficulty, correctAnswersCount, totalQuestions, mistakesCount, onStartOver }: ResultsScreenProps) {
    const scorePercentage = Math.round((correctAnswersCount / totalQuestions) * 100);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Quiz Complete!</h1>
                <div style={styles.topicBadge}>
                    {topic} - {difficulty}
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

                <button style={styles.primaryButton} onClick={onStartOver}>
                    Start Over
                </button>
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
    topicBadge: {
        backgroundColor: "#e3f2fd",
        color: "#1976d2",
        padding: "6px 12px",
        borderRadius: "16px",
        fontSize: "13px",
        fontWeight: 600,
        textTransform: "capitalize",
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
};
