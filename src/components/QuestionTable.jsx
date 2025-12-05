// src/components/QuestionTable.jsx
import { Space, Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import React from 'react';
import { useState, useEffect } from 'react';
import { mockQuestions } from '../mock/questionsData'; // 导入更多题目数据

const { Option } = Select;
const { TextArea } = Input;

const QuestionTable = ({ searchData, onRefresh }) => {
  const [allData, setAllData] = useState([...mockQuestions]); // 所有数据
  const [displayData, setDisplayData] = useState([]); // 当前显示的数据
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: mockQuestions.length,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '15', '20'],
    showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
  });
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  // 分页加载数据
  const loadPageData = (page = 1, pageSize = 5, keyword = '') => {
    setLoading(true);
    
    setTimeout(() => {
      let filteredData = [...allData];
      
      // 搜索筛选
      if (keyword && keyword.trim()) {
        filteredData = filteredData.filter(question => 
          question.questionText.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      
      // 计算分页
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageData = filteredData.slice(startIndex, endIndex);
      
      // 转换格式用于显示
      const formattedData = pageData.map((item) => ({
        key: item.id,
        id: item.id,
        question: item.questionText,
        options: item.options || [],
        answer: item.answer,
      }));
      
      setDisplayData(formattedData);
      
      // 更新分页信息
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: filteredData.length,
      }));
      
      setLoading(false);
    }, 300);
  };

  // 删除题目
  const handleDelete = async (id) => {
    try {
      // 从所有数据中删除
      const newAllData = allData.filter(q => q.id !== id);
      setAllData(newAllData);
      
      message.success('题目删除成功');
      
      // 重新加载当前页
      loadPageData(pagination.current, pagination.pageSize, searchData);
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Delete question error:', error);
      message.error('删除失败');
    }
  };

  // 编辑题目
  const handleEdit = (record) => {
    setEditingQuestion(record);
    editForm.setFieldsValue({
      question: record.question,
      optiona: record.options[0] || '',
      optionb: record.options[1] || '',
      optionc: record.options[2] || '',
      optiond: record.options[3] || '',
      answer: record.answer,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      // 更新所有数据
      const newAllData = allData.map(q => 
        q.id === editingQuestion.id 
          ? { 
              ...q, 
              questionText: values.question,
              options: [values.optiona, values.optionb, values.optionc, values.optiond],
              answer: values.answer
            }
          : q
      );
      setAllData(newAllData);
      
      message.success('题目更新成功');
      setEditModalVisible(false);
      
      // 重新加载当前页
      loadPageData(pagination.current, pagination.pageSize, searchData);
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Update question error:', error);
      message.error('更新失败');
    }
  };

  // 添加题目
  const handleAddSubmit = async (values) => {
    try {
      // 生成新ID
      const newId = allData.length > 0 ? Math.max(...allData.map(q => q.id)) + 1 : 1;
      
      // 添加到所有数据
      const newQuestion = {
        id: newId,
        questionText: values.question,
        options: [values.optiona, values.optionb, values.optionc, values.optiond],
        answer: values.answer,
      };
      
      const newAllData = [...allData, newQuestion];
      setAllData(newAllData);
      
      message.success('题目添加成功');
      setAddModalVisible(false);
      addForm.resetFields();
      
      // 重新加载到最后一页
      const totalPages = Math.ceil(newAllData.length / pagination.pageSize);
      loadPageData(totalPages, pagination.pageSize, searchData);
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Add question error:', error);
      message.error('添加失败');
    }
  };

  // 分页变化处理
  const handleTableChange = (paginationConfig) => {
    loadPageData(paginationConfig.current, paginationConfig.pageSize, searchData);
  };

  // 监听搜索数据变化
  useEffect(() => {
    if (searchData) {
      if (typeof searchData === 'string') {
        // 搜索关键词
        loadPageData(1, pagination.pageSize, searchData);
      } else if (Array.isArray(searchData)) {
        // 直接传入的搜索结果
        const formattedData = searchData.map((item, index) => ({
          key: item.id || index,
          id: item.id,
          question: item.questionText || item.question,
          options: item.options || [],
          answer: item.answer,
        }));
        
        setDisplayData(formattedData.slice(0, pagination.pageSize));
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
      title: '题目',
      dataIndex: 'question',
      key: 'question',
      render: (text) => <span style={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{text}</span>,
      width: 350,
    },
    {
      title: '选项',
      dataIndex: 'options',
      key: 'options',
      render: (options) => (
        <div>
          {options.map((option, index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                {String.fromCharCode(65 + index)}.
              </span> {option}
            </div>
          ))}
        </div>
      ),
      width: 300,
    },
    {
      title: '答案',
      dataIndex: 'answer',
      key: 'answer',
      render: (text) => (
        <span style={{ 
          color: '#52c41a', 
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          {text}
        </span>
      ),
      width: 100,
      align: 'center',
      filters: [
        { text: 'A', value: 'A' },
        { text: 'B', value: 'B' },
        { text: 'C', value: 'C' },
        { text: 'D', value: 'D' },
      ],
      onFilter: (value, record) => record.answer === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleEdit(record)}
            style={{ padding: 0, color: '#1890ff' }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个题目吗？"
            onConfirm={() => handleDelete(record.id)}
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
        <div>
          <Button 
            type="primary" 
            onClick={() => setAddModalVisible(true)}
            icon={<span>+</span>}
          >
            添加题目
          </Button>
          <span style={{ marginLeft: 16, color: '#666' }}>
            当前共 {allData.length} 个题目
          </span>
        </div>
        <div>
          <span style={{ color: '#999', fontSize: '14px' }}>
            每页显示: {pagination.pageSize} 条
          </span>
        </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={displayData}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
        bordered
        size="middle"
        scroll={{ x: 'max-content' }}
        style={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
      
      {/* 编辑题目模态框 */}
      <Modal
        title="编辑题目"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose={true}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="question"
            label="题目内容"
            rules={[{ required: true, message: '请输入题目内容!' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="请输入题目内容"
              maxLength={500}
              showCount
            />
          </Form.Item>
          
          <Form.Item
            name="optiona"
            label="选项A"
            rules={[{ required: true, message: '请输入选项A!' }]}
          >
            <Input placeholder="请输入选项A" />
          </Form.Item>
          
          <Form.Item
            name="optionb"
            label="选项B"
            rules={[{ required: true, message: '请输入选项B!' }]}
          >
            <Input placeholder="请输入选项B" />
          </Form.Item>
          
          <Form.Item
            name="optionc"
            label="选项C"
            rules={[{ required: true, message: '请输入选项C!' }]}
          >
            <Input placeholder="请输入选项C" />
          </Form.Item>
          
          <Form.Item
            name="optiond"
            label="选项D"
            rules={[{ required: true, message: '请输入选项D!' }]}
          >
            <Input placeholder="请输入选项D" />
          </Form.Item>
          
          <Form.Item
            name="answer"
            label="正确答案"
            rules={[{ required: true, message: '请选择正确答案!' }]}
          >
            <Select placeholder="请选择正确答案">
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存修改
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
      
      {/* 添加题目模态框 */}
      <Modal
        title="添加题目"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          addForm.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose={true}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddSubmit}
        >
          <Form.Item
            name="question"
            label="题目内容"
            rules={[{ required: true, message: '请输入题目内容!' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="请输入题目内容"
              maxLength={500}
              showCount
            />
          </Form.Item>
          
          <Form.Item
            name="optiona"
            label="选项A"
            rules={[{ required: true, message: '请输入选项A!' }]}
          >
            <Input placeholder="请输入选项A" />
          </Form.Item>
          
          <Form.Item
            name="optionb"
            label="选项B"
            rules={[{ required: true, message: '请输入选项B!' }]}
          >
            <Input placeholder="请输入选项B" />
          </Form.Item>
          
          <Form.Item
            name="optionc"
            label="选项C"
            rules={[{ required: true, message: '请输入选项C!' }]}
          >
            <Input placeholder="请输入选项C" />
          </Form.Item>
          
          <Form.Item
            name="optiond"
            label="选项D"
            rules={[{ required: true, message: '请输入选项D!' }]}
          >
            <Input placeholder="请输入选项D" />
          </Form.Item>
          
          <Form.Item
            name="answer"
            label="正确答案"
            rules={[{ required: true, message: '请选择正确答案!' }]}
          >
            <Select placeholder="请选择正确答案">
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                添加题目
              </Button>
              <Button onClick={() => {
                setAddModalVisible(false);
                addForm.resetFields();
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

export default QuestionTable;