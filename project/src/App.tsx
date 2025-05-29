import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Layout } from 'antd';
import DAFPage from './pages/DAFPage';
import ExercisePage from './pages/ExercisePage';
import Navigation from './components/Navigation';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4A90E2',
          borderRadius: 8,
          fontSize: 16,
        },
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Navigation />
          <Content style={{ padding: '24px', background: '#f0f2f5' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/daf" replace />} />
              <Route path="/daf" element={<DAFPage />} />
              <Route path="/exercise" element={<ExercisePage />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;