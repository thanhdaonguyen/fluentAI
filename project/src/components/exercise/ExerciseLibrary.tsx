import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Tag, Space, Progress, Modal } from 'antd';
import { PlayCircleOutlined, LockOutlined, StarOutlined } from '@ant-design/icons';
import BreathingExercise from './BreathingExercise';
import SlowReadingExercise from './SlowReadingExercise';
import RhythmExercise from './RhythmExercise';
import ConversationExercise from './ConversationExercise';
import WordStretchingExercise from './WordStretchingExercise';

const { Title, Text } = Typography;

const ExerciseLibrary: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showReadingExercise, setShowReadingExercise] = useState(false);
  const [showRhythmExercise, setShowRhythmExercise] = useState(false);
  const [showConversationExercise, setShowConversationExercise] = useState(false);
  const [showStretchingExercise, setShowStretchingExercise] = useState(false);

  const exercises = [
    {
      id: 1,
      title: 'Deep Breathing',
      category: 'Breathing',
      difficulty: 'Easy',
      duration: '5 min',
      description: 'Practice controlled breathing to improve speech flow.',
      progress: 80,
      locked: false,
      favorite: true,
    },
    {
      id: 2,
      title: 'Slow Speech Reading',
      category: 'Reading',
      difficulty: 'Medium',
      duration: '10 min',
      description: 'Read passages at a slower pace to improve fluency.',
      progress: 60,
      locked: false,
      favorite: false,
    },
    {
      id: 3,
      title: 'Rhythm and Beats',
      category: 'Rhythm',
      difficulty: 'Easy',
      duration: '7 min',
      description: 'Use rhythmic patterns to improve speech timing.',
      progress: 100,
      locked: false,
      favorite: true,
    },
    {
      id: 4,
      title: 'Conversation Practice',
      category: 'Speaking',
      difficulty: 'Hard',
      duration: '15 min',
      description: 'Practice natural conversation with AI prompts.',
      progress: 30,
      locked: false,
      favorite: false,
    },
    {
      id: 5,
      title: 'Advanced Fluency',
      category: 'Advanced',
      difficulty: 'Hard',
      duration: '20 min',
      description: 'Advanced techniques for speech fluency.',
      progress: 0,
      locked: true,
      favorite: false,
    },
    {
      id: 6,
      title: 'Word Stretching',
      category: 'Technique',
      difficulty: 'Medium',
      duration: '8 min',
      description: 'Practice stretching initial sounds of words.',
      progress: 45,
      locked: false,
      favorite: false,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'green';
      case 'Medium': return 'orange';
      case 'Hard': return 'red';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Breathing': return 'blue';
      case 'Reading': return 'purple';
      case 'Rhythm': return 'cyan';
      case 'Speaking': return 'magenta';
      case 'Technique': return 'gold';
      case 'Advanced': return 'volcano';
      default: return 'default';
    }
  };

  const handleExerciseClick = (exercise: any) => {
    if (!exercise.locked) {
      switch(exercise.id) {
        case 1:
          setShowBreathingExercise(true);
          break;
        case 2:
          setShowReadingExercise(true);
          break;
        case 3:
          setShowRhythmExercise(true);
          break;
        case 4:
          setShowConversationExercise(true);
          break;
        case 6:
          setShowStretchingExercise(true);
          break;
        default:
          setSelectedExercise(exercise);
      }
    }
  };

  const handleExerciseComplete = (exerciseId: number, score: number) => {
    // Update exercise progress
    const sessions = JSON.parse(localStorage.getItem('exerciseSessions') || '[]');
    sessions.push({
      exerciseId: exerciseId,
      score: score,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('exerciseSessions', JSON.stringify(sessions));
    
    // Close the exercise modal
    setShowBreathingExercise(false);
    setShowReadingExercise(false);
    setShowRhythmExercise(false);
    setShowConversationExercise(false);
    setShowStretchingExercise(false);
  };

  return (
    <>
      <Card title="Exercise Library">
        <Row gutter={[16, 16]}>
          {exercises.map((exercise) => (
            <Col xs={24} sm={12} lg={8} key={exercise.id}>
              <Card 
                hoverable={!exercise.locked}
                style={{ 
                  height: '100%',
                  opacity: exercise.locked ? 0.6 : 1,
                  cursor: exercise.locked ? 'not-allowed' : 'pointer',
                }}
                onClick={() => handleExerciseClick(exercise)}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={5} style={{ margin: 0 }}>{exercise.title}</Title>
                    {exercise.favorite && <StarOutlined style={{ color: '#faad14' }} />}
                    {exercise.locked && <LockOutlined />}
                  </div>
                  
                  <Space>
                    <Tag color={getCategoryColor(exercise.category)}>{exercise.category}</Tag>
                    <Tag color={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Tag>
                    <Tag>{exercise.duration}</Tag>
                  </Space>

                  <Text type="secondary">{exercise.description}</Text>

                  {!exercise.locked && (
                    <Progress 
                      percent={exercise.progress} 
                      size="small"
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                  )}

                  <Button 
                    type={exercise.locked ? 'default' : 'primary'}
                    icon={exercise.locked ? <LockOutlined /> : <PlayCircleOutlined />}
                    block
                    disabled={exercise.locked}
                  >
                    {exercise.locked ? 'Unlock at Level 5' : 'Start Exercise'}
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Modal
        title="Deep Breathing Exercise"
        open={showBreathingExercise}
        onCancel={() => setShowBreathingExercise(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <BreathingExercise onComplete={(score) => handleExerciseComplete(1, score)} />
      </Modal>

      <Modal
        title="Slow Reading Exercise"
        open={showReadingExercise}
        onCancel={() => setShowReadingExercise(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <SlowReadingExercise onComplete={(score) => handleExerciseComplete(2, score)} />
      </Modal>

      <Modal
        title="Rhythm and Beats Exercise"
        open={showRhythmExercise}
        onCancel={() => setShowRhythmExercise(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <RhythmExercise onComplete={(score) => handleExerciseComplete(3, score)} />
      </Modal>

      <Modal
        title="Conversation Practice"
        open={showConversationExercise}
        onCancel={() => setShowConversationExercise(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <ConversationExercise onComplete={(score) => handleExerciseComplete(4, score)} />
      </Modal>

      <Modal
        title="Word Stretching Exercise"
        open={showStretchingExercise}
        onCancel={() => setShowStretchingExercise(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <WordStretchingExercise onComplete={(score) => handleExerciseComplete(6, score)} />
      </Modal>

      <Modal
        title={selectedExercise?.title}
        open={!!selectedExercise}
        onCancel={() => setSelectedExercise(null)}
        footer={[
          <Button key="cancel" onClick={() => setSelectedExercise(null)}>
            Close
          </Button>,
          <Button key="start" type="primary" icon={<PlayCircleOutlined />} disabled>
            Coming Soon
          </Button>,
        ]}
      >
        {selectedExercise && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong>Category:</Text> {selectedExercise.category}
            </div>
            <div>
              <Text strong>Difficulty:</Text> {selectedExercise.difficulty}
            </div>
            <div>
              <Text strong>Duration:</Text> {selectedExercise.duration}
            </div>
            <div>
              <Text strong>Description:</Text>
              <br />
              {selectedExercise.description}
            </div>
            <div>
              <Text strong>Instructions:</Text>
              <br />
              <Text>
                This exercise is coming soon! Check back later for updates.
              </Text>
            </div>
          </Space>
        )}
      </Modal>
    </>
  );
};

export default ExerciseLibrary;