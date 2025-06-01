import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Typography, Space, Progress, Avatar, List, Tag, message } from 'antd';
import { PlayCircleOutlined, AudioOutlined, RobotOutlined, UserOutlined, RedoOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ConversationExerciseProps {
  onComplete?: (score: number) => void;
}

interface ConversationTurn {
  speaker: 'ai' | 'user';
  text: string;
  timestamp: number;
  fluencyScore?: number;
}

const ConversationExercise: React.FC<ConversationExerciseProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [userStats, setUserStats] = useState({
    totalWords: 0,
    stutterCount: 0,
    avgResponseTime: 0,
  });
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const responseStartTime = useRef<number>(0);

  const scenarios = [
    {
      title: "Ordering at a Restaurant",
      prompts: [
        "Hello! Welcome to our restaurant. What would you like to order today?",
        "Great choice! Would you like anything to drink with that?",
        "Perfect! Your order will be ready in about 15 minutes. Is that okay?",
      ]
    },
    {
      title: "Meeting a New Friend",
      prompts: [
        "Hi there! My name is Alex. What's your name?",
        "Nice to meet you! What do you like to do for fun?",
        "That sounds interesting! How long have you been doing that?",
      ]
    },
    {
      title: "Asking for Directions",
      prompts: [
        "Excuse me, you look lost. Can I help you find something?",
        "Oh, I know where that is! It's about two blocks from here. Do you want directions?",
        "You're welcome! Have a great day!",
      ]
    },
  ];

  const currentScenarioData = scenarios[currentScenario];

  useEffect(() => {
    if (isActive && !isListening && currentPromptIndex < currentScenarioData.prompts.length) {
      // AI speaks
      speakPrompt(currentScenarioData.prompts[currentPromptIndex]);
    }
  }, [isActive, currentPromptIndex, isListening]);

  const speakPrompt = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        // Add AI message to conversation
        setConversation(prev => [...prev, {
          speaker: 'ai',
          text: text,
          timestamp: Date.now(),
        }]);
        
        // Start listening for user response
        setTimeout(() => {
          responseStartTime.current = Date.now();
          setIsListening(true);
        }, 1000);
      };
      
      window.speechSynthesis.speak(utterance);
      synthesisRef.current = utterance;
    }
  };

  useEffect(() => {
    if (!isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      message.error('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';
    let wordCount = 0;
    let stutterDetected = 0;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Simple stutter detection
      const words = finalTranscript.split(/\s+/).filter(w => w.length > 0);
      wordCount = words.length;
      
      words.forEach((word, index) => {
        if (index > 0 && word.toLowerCase() === words[index - 1].toLowerCase()) {
          stutterDetected++;
        }
        if (/(.)\1{2,}/.test(word)) {
          stutterDetected++;
        }
      });
    };

    recognition.onend = () => {
      if (finalTranscript.trim()) {
        const responseTime = (Date.now() - responseStartTime.current) / 1000;
        const fluencyScore = calculateFluencyScore(wordCount, stutterDetected, responseTime);
        
        // Add user message to conversation
        setConversation(prev => [...prev, {
          speaker: 'user',
          text: finalTranscript,
          timestamp: Date.now(),
          fluencyScore: fluencyScore,
        }]);
        
        // Update stats
        setUserStats(prev => ({
          totalWords: prev.totalWords + wordCount,
          stutterCount: prev.stutterCount + stutterDetected,
          avgResponseTime: (prev.avgResponseTime + responseTime) / 2,
        }));
        
        // Move to next prompt
        if (currentPromptIndex < currentScenarioData.prompts.length - 1) {
          setCurrentPromptIndex(prev => prev + 1);
        } else {
          // Scenario complete
          handleScenarioComplete();
        }
      }
      
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;

  }, [isListening, currentPromptIndex]);

  const calculateFluencyScore = (words: number, stutters: number, responseTime: number): number => {
    // Base score from fluency
    const fluencyRate = words > 0 ? 1 - (stutters / words) : 1;
    let score = fluencyRate * 70;
    
    // Response time bonus (max 30 points)
    if (responseTime < 3) {
      score += 30;
    } else if (responseTime < 5) {
      score += 20;
    } else if (responseTime < 8) {
      score += 10;
    }
    
    return Math.round(Math.max(0, Math.min(100, score)));
  };

  const handleStart = () => {
    setIsActive(true);
    setCurrentScenario(0);
    setCurrentPromptIndex(0);
    setConversation([]);
    setUserStats({
      totalWords: 0,
      stutterCount: 0,
      avgResponseTime: 0,
    });
    setOverallScore(0);
    setIsComplete(false);
  };

  const handleScenarioComplete = () => {
    if (currentScenario < scenarios.length - 1) {
      // Move to next scenario
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
        setCurrentPromptIndex(0);
        message.success('Great job! Moving to the next scenario.');
      }, 2000);
    } else {
      // All scenarios complete
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsComplete(true);
    
    // Calculate overall score
    const userTurns = conversation.filter(turn => turn.speaker === 'user');
    const avgFluency = userTurns.reduce((sum, turn) => sum + (turn.fluencyScore || 0), 0) / userTurns.length;
    const finalScore = Math.round(avgFluency);
    setOverallScore(finalScore);
    
    if (onComplete) {
      onComplete(finalScore);
    }
    
    // Save session data
    const sessions = JSON.parse(localStorage.getItem('conversationSessions') || '[]');
    sessions.push({
      exerciseId: 4,
      type: 'conversation',
      score: finalScore,
      totalWords: userStats.totalWords,
      stutterCount: userStats.stutterCount,
      avgResponseTime: userStats.avgResponseTime,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('conversationSessions', JSON.stringify(sessions));
  };

  const handleReset = () => {
    window.speechSynthesis.cancel();
    setIsActive(false);
    setCurrentScenario(0);
    setCurrentPromptIndex(0);
    setConversation([]);
    setIsListening(false);
    setUserStats({
      totalWords: 0,
      stutterCount: 0,
      avgResponseTime: 0,
    });
    setOverallScore(0);
    setIsComplete(false);
  };

  return (
    <Card title="Conversation Practice" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {!isActive && !isComplete && (
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="large">
              <Title level={3}>Practice Real Conversations</Title>
              <Text style={{ fontSize: 16 }}>
                Engage in realistic conversations with AI. Practice speaking naturally 
                in common situations like ordering food, meeting new people, and asking for help.
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleStart}
              >
                Start Conversations
              </Button>
            </Space>
          </div>
        )}

        {isActive && (
          <>
            <Card style={{ background: '#f0f2f5' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4} style={{ margin: 0 }}>
                  Scenario: {currentScenarioData.title}
                </Title>
                <Progress
                  percent={Math.round(((currentScenario + (currentPromptIndex + 1) / currentScenarioData.prompts.length) / scenarios.length) * 100)}
                  status="active"
                />
              </Space>
            </Card>

            <List
              itemLayout="horizontal"
              dataSource={conversation}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={item.speaker === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                        style={{ backgroundColor: item.speaker === 'ai' ? '#1890ff' : '#52c41a' }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{item.speaker === 'ai' ? 'AI' : 'You'}</Text>
                        {item.fluencyScore !== undefined && (
                          <Tag color={item.fluencyScore >= 80 ? 'green' : item.fluencyScore >= 60 ? 'orange' : 'red'}>
                            {item.fluencyScore}% fluent
                          </Tag>
                        )}
                      </Space>
                    }
                    description={item.text}
                  />
                </List.Item>
              )}
            />

            {isListening && (
              <Card style={{ background: '#e6f7ff', textAlign: 'center' }}>
                <Space direction="vertical">
                  <AudioOutlined style={{ fontSize: 32, color: '#1890ff' }} className="pulse-animation" />
                  <Text strong>Listening... Speak your response!</Text>
                </Space>
              </Card>
            )}

            <Button onClick={handleReset} icon={<RedoOutlined />}>
              Reset Exercise
            </Button>
          </>
        )}

        {isComplete && (
          <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
              <Title level={4} style={{ color: '#52c41a', margin: 0 }}>
                Conversation Practice Complete!
              </Title>
              <Progress
                type="circle"
                percent={overallScore}
                strokeColor={{
                  '0%': '#ff4d4f',
                  '50%': '#faad14',
                  '100%': '#52c41a',
                }}
              />
              <Space direction="vertical">
                <Text>Total words spoken: {userStats.totalWords}</Text>
                <Text>Average response time: {userStats.avgResponseTime.toFixed(1)}s</Text>
                <Text>Fluency rate: {userStats.totalWords > 0 ? Math.round((1 - userStats.stutterCount / userStats.totalWords) * 100) : 0}%</Text>
              </Space>
              <Button type="primary" icon={<RedoOutlined />} onClick={handleReset}>
                Practice Again
              </Button>
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default ConversationExercise;