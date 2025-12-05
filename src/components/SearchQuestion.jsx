// src/components/SearchQuestion.jsx
import { Input, Button, message, Row, Col } from 'antd';
import React from 'react';
import { useState } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Search } = Input;

const SearchQuestion = ({ onSearch: onExternalSearch }) => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const onSearch = async (value) => {
    if (onExternalSearch) {
      setLoading(true);
      
      // 模拟网络延迟
      setTimeout(() => {
        onExternalSearch(value);
        if (value) {
          message.success(`正在搜索: ${value}`);
        } else {
          message.info('显示所有题目');
        }
        setLoading(false);
      }, 300);
    }
  };

  const handleReset = () => {
    setSearchValue('');
    if (onExternalSearch) {
      onExternalSearch('');
      message.info('已重置搜索');
    }
  };

  return (
    <div>
      <Row align="middle" gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={4}>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: 500,
            lineHeight: '32px',
            color: '#333'
          }}>题目:</span>
        </Col>
        <Col xs={24} sm={16}>
          <Search
            placeholder="请输入题目关键词进行搜索"
            allowClear
            enterButton={<><SearchOutlined /> 搜索</>}
            size="large"
            onSearch={onSearch}
            loading={loading}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={4}>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleReset}
            size="large"
            style={{ width: '100%' }}
          >
            重置搜索
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchQuestion;