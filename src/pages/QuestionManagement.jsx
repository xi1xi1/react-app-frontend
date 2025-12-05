// src/pages/QuestionManagement.jsx
import React from 'react';
import SearchQuestion from '../components/SearchQuestion';
import QuestionTable from '../components/QuestionTable';
import { Layout, Typography } from 'antd';
import { useState, useCallback } from 'react';

const { Content } = Layout;
const { Title } = Typography;

const QuestionManagement = () => {
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
            题目管理
          </Title>
          
          <div style={{ marginBottom: 24 }}>
            <SearchQuestion 
              onSearch={handleQuestionSearch}
            />
          </div>
          
          <QuestionTable 
            key={questionRefreshTrigger}
            searchData={questionSearchResults || questionSearchKeyword}
            onRefresh={handleQuestionRefresh}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default QuestionManagement;