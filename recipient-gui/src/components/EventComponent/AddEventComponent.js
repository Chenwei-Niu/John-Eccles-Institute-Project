import React, { useState } from 'react';
import axios from 'axios';

const AddEventComponent = ({refreshTable}) => {
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    date: '',
    venue: '',
    description: '',
    keywords: '',
    url: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInsert = async () => {
    try {
      // verify existence of required fields
      if (!formData.title) {
        alert('Title is required');
        return;
      }
      if (!formData.speaker) {
        alert('Presenter ID is required');
        return;
      }
      if (!formData.date) {
        alert('Date & Time are required');
        return;
      }
      if (!formData.venue) {
        alert('Location is required');
        return;
      }
      if (!formData.description) {
        alert('Description is required');
        return;
      }
      if (!formData.keywords) {
        alert('Keywords are required');
        return;
      }
      if (!formData.url) {
        alert('Url is required');
        return;
      }

      // send insert post to the server
      const response = await axios.post('http://localhost:3001/event/insert', formData, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      
      // due with the insertion success
      console.log('Event inserted:', response.data);
      refreshTable();
    } catch (error) {
      console.error('Error inserting event', error);
      alert('Error inserting event');
    }
  };

  return (
    <div>
      <label>Title:</label>
      <input type="text" name="title" value={formData.name} onChange={handleInputChange} required/>

      <label>Presenter ID:</label>
      <input type="text" name="speaker" value={formData.organization} onChange={handleInputChange} />
    
      <label>Date:</label>
      <input type="text" name="date" value={formData.google_scholar_id} onChange={handleInputChange}  />

      <label>Venue:</label>
      <input type="text" name="venue" value={formData.interest} onChange={handleInputChange} />
      <label>Description:</label>
      <input type="text" name="description" value={formData.interest} onChange={handleInputChange} />
      <label>Keywords:</label>
      <input type="text" name="keywords" value={formData.interest} onChange={handleInputChange} />
      <label>Url:</label>
      <input type="text" name="url" value={formData.interest} onChange={handleInputChange} />

      <button onClick={handleInsert}>Add Event</button>
    </div>
  );
};


export default AddEventComponent;