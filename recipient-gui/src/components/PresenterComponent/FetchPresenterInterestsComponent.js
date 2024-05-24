import React from 'react';
import axios from 'axios';

const FetchInterestsButton = ({refreshTable}) => {
  const handleFetchInterests = async () => {
    try {
      const response = await axios.post('http://localhost:3001/presenter/fetch-interests');
      console.log(response.data); 
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
