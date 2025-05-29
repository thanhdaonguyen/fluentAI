import React from 'react';
import { Card, Timeline, Typography, Progress, Tag, Space, Button } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PracticePlan: React.FC = () => {
  const todaysPlan = [
    {
      time: '10:00 AM',
      activity: 'Breathing Exercises',
      duration: '5 min',
      completed: true,
      type: 'breathing',
    },
    {
      time: '2:00 PM',
      activity: 'DAF Practice Session',
      duration: '15 min',
      completed: true,
      type: 'daf',
    },
    {
      time: '6:00 PM',
      activity: 'Reading Exercise',
      duration: '10 min',
      completed: false,
      type: 'reading',
    },
  ];

  const weeklyGoal = {
    target: 150, // minutes
    completed: 95,
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'breathing': return 'blue';
      case 'daf': return 'green';
      case 'reading': return 'purple';
      default: return 'default';
    }
  };

  return (
    <Card title="Today's Practice Plan">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text type="secondary">Weekly Goal Progress</Text>
          <Progress 
            percent={Math.round((weeklyGoal.completed / weeklyGoal.target) * 100)} 
            status="active"
            format={() => `${weeklyGoal.completed} / ${weeklyGoal.target} min`}
          />
        </div>

        <Timeline mode="left">
          {todaysPlan.map((item, index) => (
            <Timeline.Item 
              key={index}
              dot={item.completed ? 
                <CheckCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} /> : 
                <ClockCircleOutlined style={{ fontSize: '16px' }} />
              }
              color={item.completed ? 'green' : 'gray'}
            >
              <Space direction="vertical" size="small">
                <Space>
                  <Text strong>{item.time}</Text>
                  <Tag color={getActivityColor(item.type)}>{item.duration}</Tag>
                </Space>
                <Text>{item.activity}</Text>
                {!item.completed && (
                  <Button 
                    size="small" 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                  >
                    Start Exercise
                  </Button>
                )}
              </Space>
            </Timeline.Item>
          ))}
        </Timeline>

        <Card size="small" style={{ background: '#e6f7ff' }}>
          <Space direction="vertical" size="small">
            <Text strong>AI Recommendation:</Text>
            <Text>
              Based on your recent sessions, focus on slow speech exercises today. 
              You've shown improvement with breathing techniques!
            </Text>
          </Space>
        </Card>
      </Space>
    </Card>
  );
};

export default PracticePlan;