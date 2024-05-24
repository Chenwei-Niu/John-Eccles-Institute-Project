import React from 'react';
import axios from 'axios';

const FetchInterestsButton = ({refreshTable}) => {
  const handleFetchInterests = async () => {
    try {
      // Send a request to the backend route to handle the button click event.
      const response = await axios.post('http://localhost:3001/users/fetch-interests');
      console.log(response.data); // Process the data returned by the backend
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
