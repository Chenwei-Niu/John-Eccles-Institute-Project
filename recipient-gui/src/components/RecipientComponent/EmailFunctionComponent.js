import React from 'react';
import axios from 'axios';

const GenerateEmailComponent = ({refreshTable}) => {
  const handleGenerateEmail = async () => {
    try {
      // 发送请求到后端路由处理按钮点击事件的路由
      const response = await axios.post('http://localhost:3001/email/generate_verification_email');
      console.log(response.data); // 处理后端返回的数据
      refreshTable();
    } catch (error) {
      console.error('Error generating verification email', error);
    }
  };

  const handleSendEmail = async () => {
    try {
      const response = await axios.post('http://localhost:3001/email/send_email');
      console.log(response.data);
      alert('Sending emails to recipients.');
    } catch (error) {
      console.error('Error generating verification email', error);
    }
  };

  return (
    <><button onClick={handleGenerateEmail}>
      Generate verification email
    </button>
    <button onClick={handleSendEmail}>
        Send emails
      </button></>
  );
};

export default GenerateEmailComponent;
