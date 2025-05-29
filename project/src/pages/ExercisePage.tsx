import React from 'react';
import { Card, Row, Col, Typography, Space, Statistic, Progress, Tag, List, Button } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOutlined, ClockCircleOutlined, TrophyOutlined, RiseOutlined } from '@ant-design/icons';
import Analytics from '../components/exercise/Analytics';
import PracticePlan from '../components/exercise/PracticePlan';
import ExerciseLibrary from '../components/exercise/ExerciseLibrary';

const { Title } = Typography;

const ExercisePage: React.FC = () => {
  // Get session data from localStorage
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
  
  // Calculate statistics
  const recentSessions = sessions.slice(-10);
  const avgScore = recentSessions.length > 0 
    ? Math.round(recentSessions.reduce((acc: number, s: any) => acc + s.finalScore, 0) / recentSessions.length)
    : 0;

  const chartData = recentSessions.map((session: any, index: number) => ({
    session: `Session ${index + 1}`,
    score: session.finalScore,
  }));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        Exercises & Analytics
      </Title>

      <Row gutter={[24, 24]}>
        {/* Quick Stats */}
        <Col xs={24}>
          <Row gutter={16}>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Average Score"
                  value={avgScore}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: avgScore >= 80 ? '#52c41a' : '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Total Sessions"
                  value={sessions.length}
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Practice Streak"
                  value={3}
                  suffix="days"
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Today's Practice"
                  value={15}
                  suffix="min"
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Progress Chart */}
        <Col xs={24} lg={16}>
          <Card title="Progress Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4A90E2" 
                  strokeWidth={3}
                  dot={{ fill: '#4A90E2', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Practice Plan */}
        <Col xs={24} lg={8}>
          <PracticePlan />
        </Col>

        {/* Analytics */}
        <Col xs={24}>
          <Analytics sessions={sessions} />
        </Col>

        {/* Exercise Library */}
        <Col xs={24}>
          <ExerciseLibrary />
        </Col>
      </Row>
    </div>
  );
};

export default ExercisePage;