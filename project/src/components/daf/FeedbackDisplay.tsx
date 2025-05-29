import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { SmileOutlined, MehOutlined, FrownOutlined } from '@ant-design/icons';
import { SessionData } from '../../types/session';

const { Text, Title } = Typography;

interface FeedbackDisplayProps {
  score: number;
  sessionData: SessionData;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ score, sessionData }) => {
  const getFeedback = () => {
    if (score >= 80) {
      return {
        icon: <SmileOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
        title: 'Excellent Job!',
        message: 'Your speech was very fluent! Keep up the great work.',
        color: 'success',
      };
    } else if (score >= 60) {
      return {
        icon: <MehOutlined style={{ fontSize: 48, color: '#faad14' }} />,
        title: 'Good Progress!',
        message: 'You\'re improving! Keep practicing and you\'ll get even better.',
        color: 'warning',
      };
    } else {
      return {
        icon: <FrownOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />,
        title: 'Keep Trying!',
        message: 'Everyone has tough days. Take a break and try again!',
        color: 'error',
      };
    }
  };

  const feedback = getFeedback();

  return (
    <Card 
      title="Session Feedback" 
      style={{ textAlign: 'center' }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size="large">
        {feedback.icon}
        <Title level={4} style={{ margin: 0 }}>{feedback.title}</Title>
        <Text>{feedback.message}</Text>
        
        {sessionData.stutteredWords.length > 0 && (
          <div>
            <Text type="secondary">Words to practice:</Text>
            <div style={{ marginTop: 8 }}>
              {sessionData.stutteredWords.slice(0, 5).map((word, index) => (
                <Tag key={index} color={feedback.color}>
                  {word}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default FeedbackDisplay;