import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Typography, Space, Progress, Tag, List, message } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, RedoOutlined, AudioOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface WordStretchingExerciseProps {
  onComplete?: (score: number) => void;
}

const WordStretchingExercise: React.FC<WordStretchingExerciseProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState<{ [key: number]: number }>({});
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const practiceWords = [
    { word: 'hello', stretched: 'hhhhello', instruction: 'Stretch the "h" sound for 2 seconds' },
    { word: 'morning', stretched: 'mmmmmorning', instruction: 'Stretch the "m" sound smoothly' },
    { word: 'friend', stretched: 'ffffriend', instruction: 'Extend the "f" sound gently' },
    { word: 'sunshine', stretched: 'ssssunshine', instruction: 'Prolong the "s" sound' },
    { word: 'wonderful', stretched: 'wwwwonderful', instruction: 'Hold the "w" sound steadily' },
    { word: 'beautiful', stretched: 'bbbbbeautiful', instruction: 'Stretch the "b" sound' },
    { word: 'listen', stretched: 'lllllisten', instruction: 'Extend the "l" sound smoothly' },
    { word: 'peaceful', stretched: 'ppppeaceful', instruction: 'Hold the "p" sound gently' },
  ];

  const currentWord = practiceWords[currentWordIndex];

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
    recognition.maxAlternatives = 3;

    let detectedStretching = false;
    let startTime = Date.now();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      // Check if the word contains the target word
      if (transcript.includes(currentWord.word.toLowerCase())) {
        const duration = Date.now() - startTime;
        
        // Check if initial sound was stretched (duration > 1500ms indicates stretching)
        if (duration > 1500) {
          detectedStretching = true;
          setFeedback('Great job! You stretched the initial sound well.');
          handleWordComplete(true);
        } else if (event.results[0].isFinal) {
          setFeedback('Try to stretch the initial sound longer.');
          handleWordComplete(false);
        }
      }
    };

    recognition.onend = () => {
      if (!detectedStretching && isListening) {
        setFeedback('Remember to stretch the first sound of the word.');
        handleWordComplete(false);
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;

  }, [isListening, currentWord]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentWordIndex(0);
    setCompletedWords(new Set());
    setScore(0);
    setIsComplete(false);
    setAttempts({});
    setFeedback('');
  };

  const handlePracticeWord = () => {
    setIsListening(true);
    setFeedback('Listening... Say the word with a stretched initial sound.');
    message.info(`Say "${currentWord.word}" - ${currentWord.instruction}`);
  };

  const handleWordComplete = (success: boolean) => {
    const wordAttempts = (attempts[currentWordIndex] || 0) + 1;
    setAttempts({ ...attempts, [currentWordIndex]: wordAttempts });

    if (success) {
      setCompletedWords(prev => new Set([...Array.from(prev), currentWordIndex]));
      
      // Move to next word after a short delay
      setTimeout(() => {
        if (currentWordIndex < practiceWords.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          setFeedback('');
        } else {
          handleComplete();
        }
      }, 2000);
    }
  };

  const handleSkip = () => {
    if (currentWordIndex < practiceWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setFeedback('');
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsComplete(true);
    
    // Calculate score based on success rate and attempts
    const successRate = (completedWords.size / practiceWords.length) * 100;
    const avgAttempts = Object.values(attempts).reduce((a, b) => a + b, 0) / Object.keys(attempts).length || 1;
    const attemptBonus = Math.max(0, 100 - (avgAttempts - 1) * 20);
    
    const finalScore = Math.round((successRate * 0.7) + (attemptBonus * 0.3));
    setScore(finalScore);
    
    if (onComplete) {
      onComplete(finalScore);
    }
    
    // Save session data
    const sessions = JSON.parse(localStorage.getItem('stretchingSessions') || '[]');
    sessions.push({
      exerciseId: 6,
      type: 'stretching',
      score: finalScore,
      completedWords: completedWords.size,
      totalWords: practiceWords.length,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('stretchingSessions', JSON.stringify(sessions));
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentWordIndex(0);
    setCompletedWords(new Set());
    setScore(0);
    setIsComplete(false);
    setIsListening(false);
    setFeedback('');
    setAttempts({});
  };

  const playExample = () => {
    // In a real app, this would play an audio example
    message.info(`Example: "${currentWord.stretched}" - Listen to how the first sound is stretched.`);
  };

  return (
    <Card title="Word Stretching Exercise" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {isActive && !isComplete && (
          <>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">Word {currentWordIndex + 1} of {practiceWords.length}</Text>
              <Progress
                percent={Math.round((currentWordIndex / practiceWords.length) * 100)}
                strokeColor="#1890ff"
              />
            </div>

            <Card style={{ background: '#f0f2f5', textAlign: 'center' }}>
              <Space direction="vertical" size="large">
                <Title level={1} style={{ margin: 0, color: '#1890ff' }}>
                  {currentWord.word}
                </Title>
                <Text strong style={{ fontSize: 18 }}>
                  {currentWord.instruction}
                </Text>
                <div style={{ fontSize: 24, color: '#666', fontStyle: 'italic' }}>
                  "{currentWord.stretched}"
                </div>
              </Space>
            </Card>

            <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                type="primary"
                size="large"
                icon={<AudioOutlined />}
                onClick={handlePracticeWord}
                disabled={isListening}
                loading={isListening}
              >
                {isListening ? 'Listening...' : 'Practice This Word'}
              </Button>
              <Button
                size="large"
                onClick={playExample}
              >
                Play Example
              </Button>
              <Button
                size="large"
                onClick={handleSkip}
              >
                Skip Word
              </Button>
            </Space>

            {feedback && (
              <Card 
                style={{ 
                  background: feedback.includes('Great') ? '#f6ffed' : '#fff7e6',
                  borderColor: feedback.includes('Great') ? '#b7eb8f' : '#ffd591',
                  textAlign: 'center'
                }}
              >
                <Text strong style={{ color: feedback.includes('Great') ? '#52c41a' : '#fa8c16' }}>
                  {feedback}
                </Text>
              </Card>
            )}
          </>
        )}

        {!isActive && !isComplete && (
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="large">
              <Title level={3}>Word Stretching Technique</Title>
              <Text style={{ fontSize: 16 }}>
                This exercise helps you practice stretching the initial sounds of words, 
                which can reduce blocks and improve speech fluency.
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleStart}
              >
                Start Exercise
              </Button>
            </Space>
          </div>
        )}

        {isComplete && (
          <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
              <Title level={4} style={{ color: '#52c41a', margin: 0 }}>
                Exercise Complete!
              </Title>
              <div>
                <Text>You successfully completed </Text>
                <Text strong>{completedWords.size} out of {practiceWords.length}</Text>
                <Text> words.</Text>
              </div>
              <Progress
                type="circle"
                percent={score}
                strokeColor={{
                  '0%': '#ff4d4f',
                  '50%': '#faad14',
                  '100%': '#52c41a',
                }}
              />
              <Space>
                <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={handleReset}
                >
                  Try Again
                </Button>
              </Space>
            </Space>
          </Card>
        )}

        <Card size="small" style={{ background: '#e6f7ff' }}>
          <List
            header={<Text strong>Tips for Success:</Text>}
            dataSource={[
              'Take a deep breath before starting each word',
              'Stretch the first sound smoothly for 1-2 seconds',
              'Keep your voice relaxed and steady',
              'Move smoothly from the stretched sound into the rest of the word',
              'Practice makes perfect - repeat words that feel difficult'
            ]}
            renderItem={item => (
              <List.Item>
                <Text>{item}</Text>
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </Card>
  );
};

export default WordStretchingExercise;