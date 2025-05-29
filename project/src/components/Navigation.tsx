import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import { AudioOutlined, BarChartOutlined } from '@ant-design/icons';

const { Header } = Layout;

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: '/daf',
      label: 'DAF Practice',
      icon: <AudioOutlined />,
    },
    {
      key: '/exercise',
      label: 'Exercises & Analytics',
      icon: <BarChartOutlined />,
    },
  ];

  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4A90E2', marginRight: '40px' }}>
        FluentAI
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  );
};

export default Navigation;