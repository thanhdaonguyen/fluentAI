import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Progress, Typography, Space } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface BreathingExerciseProps {
  onComplete?: (score: number) => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [progress, setProgress] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [score, setScore] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const startTimeRef = useRef<number>(0);

  const PHASE_DURATIONS = {
    inhale: 4000, // 4 seconds
    hold: 4000,   // 4 seconds
    exhale: 6000  // 6 seconds
  };

  const TOTAL_CYCLES = 5;

  useEffect(() => {
    if (!isActive) return;

    startTimeRef.current = Date.now();
    const updateExercise = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentPhaseDuration = PHASE_DURATIONS[phase];
      const phaseProgress = (elapsed % currentPhaseDuration) / currentPhaseDuration * 100;
      
      setProgress(phaseProgress);

      // Check if phase is complete
      if (phaseProgress >= 99) {
        startTimeRef.current = Date.now();
        
        if (phase === 'inhale') {
          setPhase('hold');
        } else if (phase === 'hold') {
          setPhase('exhale');
        } else {
          setPhase('inhale');
          setCycles(prev => {
            const newCycles = prev + 1;
            if (newCycles >= TOTAL_CYCLES) {
              handleComplete();
            }
            return newCycles;
          });
        }
      }
    };

    intervalRef.current = setInterval(updateExercise, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setProgress(0);
    setCycles(0);
    setScore(100);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setProgress(0);
    setCycles(0);
    setScore(100);
  };

  const handleComplete = () => {
    setIsActive(false);
    const finalScore = Math.floor(Math.random() * (90 - 30 + 1)) + 30;
    setScore(finalScore);
    if (onComplete) {
      onComplete(finalScore);
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return '#52c41a';
      case 'hold': return '#faad14';
      case 'exhale': return '#1890ff';
      default: return '#1890ff';
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      default: return '';
    }
  };

  return (
    <Card title="Deep Breathing Exercise" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        <div>
          <Title level={2} style={{ color: getPhaseColor(), margin: 0 }}>
            {getPhaseInstruction()}
          </Title>
          <Text type="secondary">Cycle {cycles + 1} of {TOTAL_CYCLES}</Text>
        </div>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Progress
            type="circle"
            percent={progress}
            size={200}
            strokeColor={getPhaseColor()}
            format={() => ''}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 48,
            fontWeight: 'bold',
            color: getPhaseColor()
          }}>
            {Math.ceil((100 - progress) * PHASE_DURATIONS[phase] / 100000)}
          </div>
        </div>

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
            <Button
              size="large"
              icon={<PauseCircleOutlined />}
              onClick={handlePause}
            >
              Pause
            </Button>
          )}
          <Button
            size="large"
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Space>

        <Card size="small" style={{ background: '#f0f2f5' }}>
          <Text>
            Follow the breathing pattern: inhale for 4 seconds, hold for 4 seconds, 
            then exhale for 6 seconds. This helps reduce anxiety and improve speech fluency.
          </Text>
        </Card>

        {cycles === TOTAL_CYCLES && !isActive && (
          <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Space direction="vertical">
              <Title level={4} style={{ color: '#52c41a', margin: 0 }}>
                Exercise Complete!
              </Title>
              <Text>Great job! You completed all {TOTAL_CYCLES} breathing cycles.</Text>
              <Text strong>Score: {score}/100</Text>
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default BreathingExercise;