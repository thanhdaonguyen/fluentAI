import React, { useState, useRef, useEffect } from "react";
import {
    Card,
    Button,
    Progress,
    Typography,
    Space,
    Row,
    Col,
    message,
} from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import AudioVisualizer from "../components/daf/AudioVisualizer";
import SpeechToText from "../components/daf/SpeechToText";
import DAFProcessor from "../components/daf/DAFProcessor";
import FeedbackDisplay from "../components/daf/FeedbackDisplay";
import { SessionData } from "../types/session";

const { Title, Text } = Typography;

const DAFPage: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [speakingScore, setSpeakingScore] = useState(0);
    const [sessionData, setSessionData] = useState<SessionData>({
        stutteredWords: [], // Common filler words
        totalWords: 0,
        stutterCount: 0,
        sessionDuration: 0,
        finalScore: 0,
    });
    const [showFeedback, setShowFeedback] = useState(false);
    const startTimeRef = useRef<number>(0);

    const handleStart = () => {
        setIsListening(true);
        setShowFeedback(false);
        setSpeakingScore(0);
        startTimeRef.current = Date.now();
        setSessionData({
            stutteredWords: ["um", "uh", "like", "you know"],
            totalWords: 0,
            stutterCount: 0,
            sessionDuration: 0,
            finalScore: 0,
        });
        message.success("Listening started! Speak naturally.");
    };

    const handleStop = () => {
        setIsListening(false);
        const duration = (Date.now() - startTimeRef.current) / 1000;
        const finalScore = calculateFinalScore();

        setSessionData((prev) => ({
            ...prev,
            sessionDuration: duration,
            finalScore: finalScore,
        }));

        setSpeakingScore(finalScore);
        setShowFeedback(true);

        // Save session data to localStorage for analytics
        const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
        sessions.push({
            ...sessionData,
            sessionDuration: duration,
            finalScore: finalScore,
            timestamp: new Date().toISOString(),
        });
        localStorage.setItem("sessions", JSON.stringify(sessions));
    };

    const calculateFinalScore = () => {
        // if (sessionData.totalWords === 0) return 100;
        // const stutterRate =
        //     (sessionData.stutterCount / sessionData.totalWords) * 100;
        // return Math.max(0, Math.round(100 - stutterRate * 2));
        return Math.ceil(Math.random() * 100); // Placeholder for random score generation
    };

    const updateSessionData = (data: Partial<SessionData>) => {
        setSessionData((prev) => ({ ...prev, ...data }));
    };

    useEffect(() => {
        if (isListening && sessionData.totalWords > 0) {
            const currentScore = calculateFinalScore();
            setSpeakingScore(currentScore);
        }
    }, [sessionData.totalWords, sessionData.stutterCount, isListening]);

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
                DAF Practice Session
            </Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Speech Practice">
                        <Space
                            direction="vertical"
                            size="large"
                            style={{ width: "100%" }}
                        >
                            <div style={{ textAlign: "center" }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={
                                        isListening ? (
                                            <PauseCircleOutlined />
                                        ) : (
                                            <PlayCircleOutlined />
                                        )
                                    }
                                    onClick={
                                        isListening ? handleStop : handleStart
                                    }
                                    style={{
                                        height: 80,
                                        width: 200,
                                        fontSize: 20,
                                        borderRadius: 40,
                                    }}
                                >
                                    {isListening ? "Stop" : "Start"} Listening
                                </Button>
                            </div>

                            {isListening && (
                                <>
                                    <AudioVisualizer isActive={isListening} />
                                    <DAFProcessor
                                        isActive={isListening}
                                        delay={150}
                                    />
                                </>
                            )}

                            <SpeechToText
                                isListening={isListening}
                                onDataUpdate={updateSessionData}
                            />
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{ width: "100%" }}
                    >
                        <Card title="Speaking Score">
                            <Progress
                                type="circle"
                                percent={speakingScore}
                                strokeColor={{
                                    "0%": "#FF4D4F",
                                    "50%": "#FAAD14",
                                    "100%": "#52C41A",
                                }}
                                format={(percent) => (
                                    <div style={{ textAlign: "center" }}>
                                        <div
                                            style={{
                                                fontSize: 32,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {percent}%
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                color: "#666",
                                            }}
                                        >
                                            Fluency Score
                                        </div>
                                    </div>
                                )}
                            />
                        </Card>

                        {showFeedback && (
                            <FeedbackDisplay
                                score={speakingScore}
                                sessionData={sessionData}
                            />
                        )}

                        <Card title="Session Stats" size="small">
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text>Total Words:</Text>
                                    <Text strong>{sessionData.totalWords}</Text>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text>Stutters Detected:</Text>
                                    <Text strong>
                                        {sessionData.stutterCount}
                                    </Text>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text>Duration:</Text>
                                    <Text strong>
                                        {Math.round(
                                            sessionData.sessionDuration
                                        )}
                                        s
                                    </Text>
                                </div>
                            </Space>
                        </Card>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default DAFPage;
