import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Tag, Space, Progress, Modal } from 'antd';
import { PlayCircleOutlined, LockOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ExerciseLibrary: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

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
      setSelectedExercise(exercise);
    }
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
        title={selectedExercise?.title}
        open={!!selectedExercise}
        onCancel={() => setSelectedExercise(null)}
        footer={[
          <Button key="cancel" onClick={() => setSelectedExercise(null)}>
            Close
          </Button>,
          <Button key="start" type="primary" icon={<PlayCircleOutlined />}>
            Start Exercise
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
                This exercise will guide you through specific techniques to improve your speech fluency. 
                Follow the on-screen prompts and practice at your own pace.
              </Text>
            </div>
          </Space>
        )}
      </Modal>
    </>
  );
};

export default ExerciseLibrary;