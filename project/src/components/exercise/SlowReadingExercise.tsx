import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Typography, Space, Progress, Tag, message, Row, Col, Statistic } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, RedoOutlined, AudioOutlined, BookOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface SlowReadingExerciseProps {
  onComplete?: (score: number) => void;
}

const SlowReadingExercise: React.FC<SlowReadingExerciseProps> = ({ onComplete }) => {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [stutteredWords, setStutteredWords] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const wordTimestampsRef = useRef<number[]>([]);

  const passage = "The sun rises slowly over the calm blue ocean. Birds fly gracefully across the clear morning sky. The gentle waves create a peaceful rhythm on the sandy shore. It is a beautiful day to practice speaking clearly and confidently.";
  
  const words = passage.split(' ');
  const TARGET_WPM = 100; // Target words per minute for slow speech

  useEffect(() => {
    if (!isReading || isPaused) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      message.error('Speech recognition not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let lastProcessedIndex = -1;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.toLowerCase();
          const spokenWords = transcript.trim().split(/\s+/);
          
          // Match spoken words with passage words
          spokenWords.forEach((spokenWord: string) => {
            const cleanSpoken = spokenWord.replace(/[^a-z]/g, '');
            
            // Find the next matching word in the passage
            for (let j = lastProcessedIndex + 1; j < words.length; j++) {
              const passageWord = words[j].toLowerCase().replace(/[^a-z]/g, '');
              
              if (passageWord.includes(cleanSpoken) || cleanSpoken.includes(passageWord)) {
                setCurrentWordIndex(j);
                wordTimestampsRef.current[j] = Date.now();
                lastProcessedIndex = j;
                
                // Check for stuttering (repeated sounds or prolongations)
                if (spokenWord.match(/(.)\1{2,}/) || // Prolongations
                    (j > 0 && cleanSpoken === words[j-1].toLowerCase().replace(/[^a-z]/g, ''))) { // Repetitions
                  setStutteredWords(prev => new Set([...Array.from(prev), j]));
                }
                
                break;
              }
            }
          });
          
          // Calculate WPM
          const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
          const wordsRead = lastProcessedIndex + 1;
          if (wordsRead > 0) {
            setWordsPerMinute(Math.round(wordsRead / elapsedMinutes));
          }
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        recognition.stop();
        recognition.start();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isReading, isPaused, words]);

  const handleStart = () => {
    setIsReading(true);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    setStutteredWords(new Set());
    setScore(0);
    setIsComplete(false);
    setWordsPerMinute(0);
    startTimeRef.current = Date.now();
    wordTimestampsRef.current = [];
    message.info('Start reading the passage slowly and clearly');
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsReading(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    setStutteredWords(new Set());
    setScore(0);
    setIsComplete(false);
    setWordsPerMinute(0);
  };

  const calculateScore = () => {
    const totalWords = words.length;
    const wordsRead = currentWordIndex + 1;
    const stutterCount = stutteredWords.size;
    
    // Score based on: completion, stuttering rate, and speech pace
    let finalScore = 0;
    
    // Completion score (40%)
    const completionScore = (wordsRead / totalWords) * 40;
    
    // Fluency score (40%)
    const fluencyRate = 1 - (stutterCount / Math.max(wordsRead, 1));
    const fluencyScore = fluencyRate * 40;
    
    // Pace score (20%) - bonus for maintaining target pace
    const paceDiff = Math.abs(wordsPerMinute - TARGET_WPM);
    const paceScore = Math.max(0, 20 - (paceDiff / TARGET_WPM) * 20);
    
    finalScore = Math.round(completionScore + fluencyScore + paceScore);
    setScore(finalScore);
    setIsComplete(true);
    
    if (onComplete) {
      onComplete(finalScore);
    }
    
    // Save session data
    const sessions = JSON.parse(localStorage.getItem('readingSessions') || '[]');
    sessions.push({
      exerciseId: 2,
      type: 'reading',
      score: finalScore,
      wordsRead: wordsRead,
      stutterCount: stutterCount,
      wpm: wordsPerMinute,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('readingSessions', JSON.stringify(sessions));
  };

  useEffect(() => {
    if (currentWordIndex === words.length - 1) {
      // Completed reading
      setTimeout(() => {
        setIsReading(false);
        calculateScore();
      }, 1000);
    }
  }, [currentWordIndex]);

  const renderPassage = () => {
    return words.map((word, index) => {
      const isCurrentWord = index === currentWordIndex;
      const isRead = index <= currentWordIndex;
      const isStuttered = stutteredWords.has(index);
      
      return (
        <span
          key={index}
          style={{
            padding: '2px 4px',
            margin: '2px',
            borderRadius: '4px',
            backgroundColor: isCurrentWord ? '#1890ff' : isRead ? '#f0f0f0' : 'transparent',
            color: isCurrentWord ? '#fff' : isStuttered ? '#ff4d4f' : isRead ? '#52c41a' : '#000',
            fontWeight: isCurrentWord ? 'bold' : 'normal',
            fontSize: '20px',
            lineHeight: '32px',
            display: 'inline-block',
            transition: 'all 0.3s ease',
          }}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <Card title="Slow Speech Reading Exercise" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card style={{ background: '#f5f5f5' }}>
          <Paragraph style={{ margin: 0, fontSize: '18px' }}>
            {renderPassage()}
          </Paragraph>
        </Card>

        <Row gutter={16}>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Words Read"
                value={`${Math.max(0, currentWordIndex + 1)} / ${words.length}`}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Speech Pace"
                value={wordsPerMinute}
                suffix="WPM"
                valueStyle={{ color: Math.abs(wordsPerMinute - TARGET_WPM) < 20 ? '#52c41a' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Stutters"
                value={stutteredWords.size}
                valueStyle={{ color: stutteredWords.size === 0 ? '#52c41a' : '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        <Space size="large" style={{ justifyContent: 'center', width: '100%' }}>
          {!isReading ? (
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={handleStart}
            >
              Start Reading
            </Button>
          ) : (
            <>
              <Button
                size="large"
                icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                onClick={handlePause}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                size="large"
                icon={<RedoOutlined />}
                onClick={handleReset}
              >
                Reset
              </Button>
            </>
          )}
        </Space>

        <Card size="small" style={{ background: '#e6f7ff' }}>
          <Space direction="vertical">
            <Text strong>Instructions:</Text>
            <Text>
              Read the passage aloud at a slow, steady pace (around {TARGET_WPM} words per minute). 
              Focus on speaking each word clearly and completely. The system will track your progress 
              and highlight any words where stuttering is detected.
            </Text>
          </Space>
        </Card>

        {isComplete && (
          <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
              <Title level={4} style={{ color: '#52c41a', margin: 0 }}>
                Exercise Complete!
              </Title>
              <Text>You read {currentWordIndex + 1} out of {words.length} words.</Text>
              <Progress
                percent={score}
                strokeColor={{
                  '0%': '#ff4d4f',
                  '50%': '#faad14',
                  '100%': '#52c41a',
                }}
              />
              <Text strong>Tips for improvement:</Text>
              {wordsPerMinute > TARGET_WPM + 20 && (
                <Text>Try reading more slowly next time.</Text>
              )}
              {stutteredWords.size > 3 && (
                <Text>Practice the highlighted words separately.</Text>
              )}
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default SlowReadingExercise;