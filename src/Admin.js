// src/Admin.js
import { Layout, Menu } from 'antd';
import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import React from 'react';
import SearchUser from './components/SearchUser';
import UserTable from './components/UserTable';
import SearchQuestion from './components/SearchQuestion';
import QuestionTable from './components/QuestionTable';
import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

// 创建内容组件
const UserManagementContent = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserSearch = useCallback((keyword, results) => {
    setSearchKeyword(keyword);
    if (results) {
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  }, []);

  const handleUserRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    setSearchKeyword('');
    setSearchResults(null);
  }, []);

  return (
    <>
      <SearchUser onSearch={handleUserSearch} />
      <UserTable 
        key={refreshTrigger}
        searchData={searchResults || searchKeyword}
        onRefresh={handleUserRefresh}
      />
    </>
  );
};

const QuestionManagementContent = () => {
  const [questionSearchKeyword, setQuestionSearchKeyword] = useState('');
  const [questionSearchResults, setQuestionSearchResults] = useState(null);
  const [questionRefreshTrigger, setQuestionRefreshTrigger] = useState(0);

  const handleQuestionSearch = useCallback((keyword, results) => {
    setQuestionSearchKeyword(keyword);
    if (results) {
      setQuestionSearchResults(results);
    } else {
      setQuestionSearchResults(null);
    }
  }, []);

  const handleQuestionRefresh = useCallback(() => {
    setQuestionRefreshTrigger(prev => prev + 1);
    setQuestionSearchKeyword('');
    setQuestionSearchResults(null);
  }, []);

  return (
    <>
      <SearchQuestion onSearch={handleQuestionSearch} />
      <QuestionTable 
        key={questionRefreshTrigger}
        searchData={questionSearchResults || questionSearchKeyword}
        onRefresh={handleQuestionRefresh}
      />
    </>
  );
};

// 主布局组件
const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 根据当前路由设置高亮
  const getSelectedKey = () => {
    if (location.pathname === '/user') return '1';
    if (location.pathname === '/question') return '2';
    return '1'; // 默认
  };

  const handleMenuClick = ({ key }) => {
    if (key === '1') {
      navigate('/user');
    } else if (key === '2') {
      navigate('/question');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#001529', 
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          color: '#ffffff', 
          margin: 0, 
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Quiz管理系统
        </h1>
      </Header>
      <Layout>
        <Sider 
          width={200} 
          style={{ 
            background: '#001529',
            overflow: 'auto',
            height: 'calc(100vh - 64px - 70px)',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 70
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            selectedKeys={[getSelectedKey()]}
            onClick={handleMenuClick}
            items={[
              { 
                key: '1', 
                icon: <UserOutlined />, 
                label: '用户管理',
                style: { margin: '8px 0' }
              },
              { 
                key: '2', 
                icon: <VideoCameraOutlined />, 
                label: '题目管理',
                style: { margin: '8px 0' }
              }
            ]}
            style={{ 
              height: '100%', 
              borderRight: 0,
              padding: '8px 0'
            }}
          />
        </Sider>
        <Content style={{ 
          marginLeft: 200,
          padding: '24px',
          background: '#f0f2f5',
          minHeight: 'calc(100vh - 64px - 70px)'
        }}>
          <div style={{ 
            background: '#fff', 
            padding: 24, 
            borderRadius: 8,
            minHeight: 'calc(100vh - 64px - 70px - 48px)'
          }}>
            <Routes>
              <Route path="/" element={<div>请选择左侧菜单</div>} />
              <Route path="/user" element={<UserManagementContent />} />
              <Route path="/question" element={<QuestionManagementContent />} />
            </Routes>
          </div>
        </Content>
      </Layout>
      <Footer style={{ 
        textAlign: 'center', 
        padding: '16px 50px',
        background: '#f0f2f5',
        borderTop: '1px solid #e8e8e8'
      }}>
        Quiz管理系统 ©2025 Created by tfzhang
      </Footer>
    </Layout>
  );
};

// 主组件
const Admin = () => {
  return (
    <Router>
      <AdminLayout />
    </Router>
  );
};

export default Admin;