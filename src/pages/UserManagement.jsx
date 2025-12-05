// src/pages/UserManagement.jsx
import React from 'react';
import SearchUser from '../components/SearchUser';
import UserTable from '../components/UserTable';
import { Layout, Typography } from 'antd';
import { useState, useCallback } from 'react';

const { Content } = Layout;
const { Title } = Typography;

const UserManagement = () => {
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
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ 
        padding: '24px',
        background: '#f0f2f5',
        minHeight: '100vh'
      }}>
        <div style={{ 
          background: '#fff', 
          padding: 24, 
          borderRadius: 8,
          minHeight: 'calc(100vh - 48px)'
        }}>
          <Title level={2} style={{ marginBottom: 24 }}>
            用户管理
          </Title>
          
          <div style={{ marginBottom: 24 }}>
            <SearchUser 
              onSearch={handleUserSearch}
            />
          </div>
          
          <UserTable 
            key={refreshTrigger}
            searchData={searchResults || searchKeyword}
            onRefresh={handleUserRefresh}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default UserManagement;