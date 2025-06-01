import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Typography, Space, Progress, Row, Col } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, RedoOutlined, SoundOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface RhythmExerciseProps {
  onComplete?: (score: number) => void;
}

const RhythmExercise: React.FC<RhythmExerciseProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentSyllable, setCurrentSyllable] = useState(0);
  const [score, setScore] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userRhythm, setUserRhythm] = useState<boolean[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const beatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const BPM = 60; // Beats per minute
  const BEAT_DURATION = 60000 / BPM; // Duration of each beat in ms

  const rhythmPatterns = [
    { text: "I can speak", syllables: ["I", "can", "speak"], pattern: [true, true, true, false] },
    { text: "Nice and slow", syllables: ["Nice", "and", "slow"], pattern: [true, true, true, false] },
    { text: "Step by step", syllables: ["Step", "by", "step"], pattern: [true, true, true, false] },
    { text: "Clear and calm", syllables: ["Clear", "and", "calm"], pattern: [true, true, true, false] },
    { text: "I am confident", syllables: ["I", "am", "con", "fi", "dent"], pattern: [true, true, true, true, true] },
  ];

  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const currentPattern = rhythmPatterns[currentPatternIndex];

  useEffect(() => {
    if (!isActive || isPaused) {
      if (beatIntervalRef.current) {
        clearInterval(beatIntervalRef.current);
      }
      return;
    }

    beatIntervalRef.current = setInterval(() => {
      setCurrentBeat(prev => {
        const nextBeat = (prev + 1) % currentPattern.pattern.length;
        if (nextBeat === 0 && prev !== 0) {
          // Pattern completed, move to next
          handlePatternComplete();
        }
        return nextBeat;
      });
    }, BEAT_DURATION);

    return () => {
      if (beatIntervalRef.current) {
        clearInterval(beatIntervalRef.current);
      }
    };
  }, [isActive, isPaused, currentPattern]);

  useEffect(() => {
    // Play metronome sound
    if (isActive && !isPaused && audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = currentPattern.pattern[currentBeat] ? 800 : 400;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.05);
    }
  }, [currentBeat, isActive, isPaused]);

  useEffect(() => {
    if (!isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.toLowerCase();
          // Check if user spoke on the beat
          setUserRhythm(prev => [...prev, currentPattern.pattern[currentBeat]]);
          
          // Move to next syllable
          setCurrentSyllable(prev => Math.min(prev + 1, currentPattern.syllables.length - 1));
        }
      }
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, currentBeat, currentPattern]);

  const handleStart = () => {
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    setIsActive(true);
    setIsPaused(false);
    setIsListening(true);
    setCurrentBeat(0);
    setCurrentSyllable(0);
    setCurrentPatternIndex(0);
    setScore(100);
    setIsComplete(false);
    setUserRhythm([]);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    setIsListening(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsListening(false);
    setCurrentBeat(0);
    setCurrentSyllable(0);
    setCurrentPatternIndex(0);
    setScore(100);
    setIsComplete(false);
    setUserRhythm([]);
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const handlePatternComplete = () => {
    setCurrentSyllable(0);
    setUserRhythm([]);
    
    if (currentPatternIndex < rhythmPatterns.length - 1) {
      setCurrentPatternIndex(prev => prev + 1);
    } else {
      // Exercise complete
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsListening(false);
    setIsComplete(true);
    
    // Calculate score based on rhythm accuracy
    const finalScore = Math.round(score);
    setScore(finalScore);
    
    if (onComplete) {
      onComplete(finalScore);
    }
    
    // Save session data
    const sessions = JSON.parse(localStorage.getItem('rhythmSessions') || '[]');
    sessions.push({
      exerciseId: 3,
      type: 'rhythm',
      score: finalScore,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('rhythmSessions', JSON.stringify(sessions));
  };

  const renderBeatIndicators = () => {
    return currentPattern.pattern.map((isStrong, index) => (
      <Col key={index} span={Math.floor(24 / currentPattern.pattern.length)}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: currentBeat === index ? (isStrong ? '#52c41a' : '#1890ff') : '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            transition: 'all 0.2s ease',
            transform: currentBeat === index ? 'scale(1.2)' : 'scale(1)',
            boxShadow: currentBeat === index ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          {isStrong && index < currentPattern.syllables.length && (
            <Text strong style={{ color: currentBeat === index ? '#fff' : '#000' }}>
              {currentPattern.syllables[index]}
            </Text>
          )}
        </div>
      </Col>
    ));
  };

  return (
    <Card title="Rhythm and Beats Exercise" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        <div>
          <Title level={3}>Pattern {currentPatternIndex + 1} of {rhythmPatterns.length}</Title>
          <Title level={2} style={{ color: '#1890ff', margin: '16px 0' }}>
            "{currentPattern.text}"
          </Title>
        </div>

        <Card style={{ background: '#f5f5f5' }}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            {renderBeatIndicators()}
          </Row>
          <Progress
            percent={((currentPatternIndex + 1) / rhythmPatterns.length) * 100}
            showInfo={false}
            strokeColor="#52c41a"
          />
        </Card>

        <Space size="large">
          {!isActive ? (
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={handleStart}
            >
              Start Exercise
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
            <SoundOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Text strong>How to practice:</Text>
            <Text>
              Speak each syllable on the strong beats (colored circles). 
              Follow the rhythm pattern and keep time with the metronome. 
              This helps develop smooth, rhythmic speech patterns.
            </Text>
          </Space>
        </Card>

        {isComplete && (
          <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Space direction="vertical">
              <Title level={4} style={{ color: '#52c41a', margin: 0 }}>
                Rhythm Exercise Complete!
              </Title>
              <Text>You completed all {rhythmPatterns.length} rhythm patterns!</Text>
              <Text strong>Score: {score}/100</Text>
              <Text>Keep practicing to improve your speech rhythm and timing.</Text>
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default RhythmExercise;