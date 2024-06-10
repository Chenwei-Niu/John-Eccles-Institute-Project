import React from 'react';
import axios from 'axios';

const GenerateEmailComponent = ({refreshTable}) => {
  const handleGenerateEmail = async () => {
    try {
      // Send a request to the backend route to handle the button click event.
      const response = await axios.post('http://localhost:3001/email/generate_verification_email');
      console.log(response.data); // Process the data returned by the backend
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
      console.error('Error sending email', error);
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
