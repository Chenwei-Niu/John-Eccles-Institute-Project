import React, { useState } from 'react';
import axios from 'axios';

const AddRecipientComponent = ({refreshTable}) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    organization: '',
    interest: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInsert = async () => {
    try {
      // Verify that the email address exists
      if (!formData.email) {
        alert('Email is required');
        return;
      }
      if (!isValidEmail(formData.email)){
        alert('Email is invalid, please check and try again.');
        return;
      }

      // Send insert request to server
      const response = await axios.post('http://localhost:3001/users/insert', formData, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      
      // Logic to handle insertion success
      console.log('User inserted:', response.data);
      refreshTable();
    } catch (error) {
      console.error('Error inserting user', error);
      alert('Error inserting user');
    }
  };

  return (
    <div>
      <label>Email:</label>
      <input type="text" name="email" value={formData.email} onChange={handleInputChange} required />

      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleInputChange} />

      <label>Organization:</label>
      <input type="text" name="organization" value={formData.organization} onChange={handleInputChange} />

      <label>Interest:</label>
      <input type="text" name="interest" value={formData.interest} onChange={handleInputChange} />

      <button onClick={handleInsert}>Insert User</button>
    </div>
  );
};

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

export default AddRecipientComponent;