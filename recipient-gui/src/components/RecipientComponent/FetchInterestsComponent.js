import React from 'react';
import axios from 'axios';

const FetchInterestsButton = ({refreshTable}) => {
  const handleFetchInterests = async () => {
    try {
      // 发送请求到后端路由处理按钮点击事件的路由
      const response = await axios.post('http://localhost:3001/users/fetch-interests');
      console.log(response.data); // 处理后端返回的数据
      refreshTable();
    } catch (error) {
      console.error('Error fetching interests', error);
    }
  };

  return (
    <button onClick={handleFetchInterests}>
      Fetch Interests from Google Scholar
    </button>
  );
};

export default FetchInterestsButton;
