// src/components/SearchUser.jsx
import { Input, Button, message, Row, Col } from 'antd';
import React from 'react';
import { useState } from 'react';
import { Modal } from 'antd';
import AddUser from './AddUser';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';

const { Search } = Input;

const SearchUser = ({ onSearch: onExternalSearch }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleAddSuccess = (newUser) => {
    setOpen(false);
    message.success(`用户 "${newUser.username}" 添加成功`);
    if (onExternalSearch) onExternalSearch('');
  };

  const onSearch = (value) => {
    if (onExternalSearch) {
      onExternalSearch(value);
      if (value) {
        message.success(`正在搜索用户: ${value}`);
      } else {
        message.info('显示所有用户');
      }
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
          }}>用户名:</span>
        </Col>
        <Col xs={24} sm={16}>
          <Search
            placeholder="请输入用户名进行搜索"
            allowClear
            enterButton={<><SearchOutlined /> 搜索</>}
            size="large"
            onSearch={onSearch}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={4}>
          <Button 
            type="primary" 
            onClick={showModal}
            icon={<UserAddOutlined />}
            size="large"
            style={{ width: '100%' }}
          >
            添加用户
          </Button>
        </Col>
      </Row>
      
      <Modal
        title="添加用户"
        open={open}
        footer={null}
        onCancel={handleCancel}
        width={600}
        destroyOnClose={true}
      >
        <AddUser onSuccess={handleAddSuccess} onCancel={handleCancel} />
      </Modal>
    </div>
  );
};

export default SearchUser;