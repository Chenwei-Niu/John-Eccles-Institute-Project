import React, { useState } from 'react';
import axios from 'axios';

const AddPresenterComponent = ({refreshTable}) => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    google_scholar_id: '',
    interest: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInsert = async () => {
    try {
      // verify name existence
      if (!formData.name) {
        alert('name is required');
        return;
      }

      // send insert post to the server
      const response = await axios.post('http://localhost:3001/presenter/insert', formData, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      
      // due with the insertion success
      console.log('Presenter inserted:', response.data);
      refreshTable();
    } catch (error) {
      console.error('Error inserting presenter', error);
      alert('Error inserting presenter');
    }
  };

  return (
    <div>
      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required/>

      <label>Organization:</label>
      <input type="text" name="organization" value={formData.organization} onChange={handleInputChange} />
    
      <label>Google Scholar ID:</label>
      <input type="text" name="google_scholar_id" value={formData.google_scholar_id} onChange={handleInputChange}  />

      <label>Interest:</label>
      <input type="text" name="interest" value={formData.interest} onChange={handleInputChange} />

      <button onClick={handleInsert}>Add Presenter</button>
    </div>
  );
};


export default AddPresenterComponent;