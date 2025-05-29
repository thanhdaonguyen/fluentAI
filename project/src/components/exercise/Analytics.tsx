import React from 'react';
import { Card, Row, Col, Typography, Table, Tag, Empty } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

interface AnalyticsProps {
  sessions: any[];
}

const Analytics: React.FC<AnalyticsProps> = ({ sessions }) => {
  // Calculate stuttered words frequency
  const wordFrequency: { [key: string]: number } = {};
  sessions.forEach(session => {
    if (session.stutteredWords) {
      session.stutteredWords.forEach((word: string) => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    }
  });

  // Get top stuttered words
  const topWords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  // Calculate stuttering rate over time
  const recentSessions = sessions.slice(-7);
  const rateData = recentSessions.map((session, index) => ({
    day: `Day ${index + 1}`,
    rate: session.totalWords > 0 
      ? Math.round((session.stutterCount / session.totalWords) * 100)
      : 0,
  }));

  const columns = [
    {
      title: 'Word',
      dataIndex: 'word',
      key: 'word',
      render: (word: string) => <Tag color="blue">{word}</Tag>,
    },
    {
      title: 'Frequency',
      dataIndex: 'count',
      key: 'count',
      render: (count: number) => <Text strong>{count} times</Text>,
    },
  ];

  return (
    <Card title="Speech Analytics">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Title level={5}>Stuttering Rate Trend</Title>
          {rateData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="rate" fill="#ff7875" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Empty description="No session data available" />
          )}
        </Col>

        <Col xs={24} lg={12}>
          <Title level={5}>Most Frequently Stuttered Words</Title>
          {topWords.length > 0 ? (
            <Table 
              columns={columns} 
              dataSource={topWords}
              rowKey="word"
              pagination={false}
              size="small"
            />
          ) : (
            <Empty description="No stuttered words recorded yet" />
          )}
        </Col>

        <Col xs={24}>
          <Row gutter={16}>
            <Col span={8}>
              <Card size="small">
                <Text type="secondary">Average Session Duration</Text>
                <Title level={4}>
                  {sessions.length > 0 
                    ? `${Math.round(sessions.reduce((acc, s) => acc + s.sessionDuration, 0) / sessions.length)}s`
                    : '0s'
                  }
                </Title>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Text type="secondary">Total Words Spoken</Text>
                <Title level={4}>
                  {sessions.reduce((acc, s) => acc + (s.totalWords || 0), 0)}
                </Title>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Text type="secondary">Improvement Rate</Text>
                <Title level={4} style={{ color: '#52c41a' }}>
                  {sessions.length >= 2 
                    ? `${Math.round(((sessions[sessions.length - 1].finalScore - sessions[0].finalScore) / sessions[0].finalScore) * 100)}%`
                    : 'N/A'
                  }
                </Title>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default Analytics;