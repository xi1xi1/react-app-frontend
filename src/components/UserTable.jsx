// src/components/UserTable.jsx
import { Space, Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import React from 'react';
import { useState, useEffect } from 'react';

const UserTable = ({ searchData, onRefresh }) => {
  // 生成更多用户数据
  const generateUsers = () => {
    const users = [];
    for (let i = 1; i <= 25; i++) {
      users.push({
        id: i,
        userName: i === 1 ? 'admin' : `user${i}`,
        userRole: i === 1 ? 1 : 0,
        createTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updateTime: new Date(Date.now() - Math.floor(i / 2) * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    return users;
  };

  const [allData, setAllData] = useState(generateUsers());
  const [displayData, setDisplayData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 25,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '15', '20'],
    showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();

  // 分页加载数据
  const loadPageData = (page = 1, pageSize = 5, keyword = '') => {
    let filteredData = [...allData];
    
    // 搜索筛选
    if (keyword && keyword.trim()) {
      filteredData = filteredData.filter(user => 
        user.userName.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    // 计算分页
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    setDisplayData(pageData);
    
    // 更新分页信息
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize,
      total: filteredData.length,
    }));
  };

  // 删除用户
  const handleDelete = (id, username) => {
    const newAllData = allData.filter(user => user.id !== id);
    setAllData(newAllData);
    message.success(`用户 "${username}" 已删除`);
    
    // 重新加载当前页
    loadPageData(pagination.current, pagination.pageSize, searchData);
    if (onRefresh) onRefresh();
  };

  // 编辑用户
  const handleEdit = (record) => {
    setEditingUser(record);
    editForm.setFieldsValue({
      username: record.userName,
      password: '',
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = (values) => {
    const newAllData = allData.map(user => 
      user.id === editingUser.id 
        ? { 
            ...user, 
            userName: values.username, 
            updateTime: new Date().toISOString() 
          }
        : user
    );
    setAllData(newAllData);
    message.success('用户已更新');
    setEditModalVisible(false);
    
    // 重新加载当前页
    loadPageData(pagination.current, pagination.pageSize, searchData);
    if (onRefresh) onRefresh();
  };

  // 分页变化处理
  const handleTableChange = (paginationConfig) => {
    loadPageData(paginationConfig.current, paginationConfig.pageSize, searchData);
  };

  useEffect(() => {
    if (searchData) {
      if (typeof searchData === 'string') {
        // 搜索关键词
        loadPageData(1, pagination.pageSize, searchData);
      } else if (Array.isArray(searchData)) {
        // 直接传入的搜索结果
        setDisplayData(searchData.slice(0, pagination.pageSize));
        setPagination(prev => ({
          ...prev,
          current: 1,
          total: searchData.length,
        }));
      }
    } else {
      // 显示所有数据
      loadPageData(pagination.current, pagination.pageSize);
    }
  }, [searchData]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: '用户角色',
      dataIndex: 'userRole',
      key: 'userRole',
      render: (role) => (
        <span style={{ color: role === 1 ? '#1890ff' : '#52c41a' }}>
          {role === 1 ? '管理员' : '普通用户'}
        </span>
      ),
      filters: [
        { text: '管理员', value: 1 },
        { text: '普通用户', value: 0 },
      ],
      onFilter: (value, record) => record.userRole === value,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
      sorter: (a, b) => new Date(a.updateTime) - new Date(b.updateTime),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleEdit(record)}
            style={{ padding: 0 }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除用户 "${record.userName}" 吗？`}
            onConfirm={() => handleDelete(record.id, record.userName)}
            okText="确定"
            cancelText="取消"
            okType="danger"
          >
            <Button 
              type="link" 
              size="small" 
              danger
              style={{ padding: 0 }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#666' }}>
          当前共 {allData.length} 个用户
        </span>
        <span style={{ color: '#999', fontSize: '14px' }}>
          每页显示: {pagination.pageSize} 条
        </span>
      </div>
      
      <Table
        columns={columns}
        dataSource={displayData}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        bordered
        size="middle"
        style={{ 
          marginTop: 16,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
      
      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名!' },
              { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字!' }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6位!' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                editForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserTable;