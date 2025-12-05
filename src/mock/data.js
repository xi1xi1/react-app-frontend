// src/mock/data.js
export const mockUsers = [
  { id: 1, userName: 'admin', userRole: 1, createTime: '2025-12-01T08:00:00', updateTime: '2025-12-01T08:00:00' },
  { id: 2, userName: 'user1', userRole: 0, createTime: '2025-12-02T09:00:00', updateTime: '2025-12-02T09:00:00' },
  { id: 3, userName: 'user2', userRole: 0, createTime: '2025-12-03T10:00:00', updateTime: '2025-12-03T10:00:00' },
  { id: 4, userName: 'user3', userRole: 0, createTime: '2025-12-04T11:00:00', updateTime: '2025-12-04T11:00:00' },
  { id: 5, userName: 'user4', userRole: 0, createTime: '2025-12-05T12:00:00', updateTime: '2025-12-05T12:00:00' },
];

export const mockQuestions = [
  { 
    id: 1, 
    questionText: 'React是什么？', 
    options: ['一个JavaScript库', '一个CSS框架', '一个数据库', '一个操作系统'], 
    answer: 'A' 
  },
  { 
    id: 2, 
    questionText: 'JavaScript是什么语言？', 
    options: ['编译型语言', '解释型语言', '标记语言', '样式语言'], 
    answer: 'B' 
  },
  { 
    id: 3, 
    questionText: 'HTML是什么？', 
    options: ['编程语言', '标记语言', '样式语言', '数据库语言'], 
    answer: 'B' 
  },
  { 
    id: 4, 
    questionText: 'CSS的作用是什么？', 
    options: ['网页结构', '网页样式', '网页交互', '数据存储'], 
    answer: 'B' 
  },
  { 
    id: 5, 
    questionText: 'Vue.js的创建者是谁？', 
    options: ['Evan You', 'Jordan Walke', 'Ryan Dahl', 'Brendan Eich'], 
    answer: 'A' 
  },
];