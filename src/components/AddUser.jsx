// src/components/AddUser.jsx
import { Form, Input, Button, Select, message } from 'antd';
import React from 'react';

const { Option } = Select;

const AddUser = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    message.success('用户添加成功');
    form.resetFields();
    if (onSuccess) onSuccess(values);
  };

  return (
    <Form
      form={form}
      name="addUser"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
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
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item
        name="userrole"
        label="用户角色"
        rules={[{ required: true, message: '请选择用户角色!' }]}
      >
        <Select placeholder="请选择角色">
          <Option value="0">普通用户</Option>
          <Option value="1">管理员</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
        <Button 
          style={{ marginLeft: 8 }} 
          onClick={() => {
            form.resetFields();
            if (onCancel) onCancel();
          }}
        >
          取消
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddUser;