import React, { useEffect, useState } from 'react';
import SearchComponent from '../SearchComponent';
import PresenterTableComponent from './PresenterTableComponent';
import AddPresenterComponent from './AddPresenterComponent';
import axios from 'axios';

function Presenter() {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(()=>{
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/presenter/data');
      setOriginalData(response.data);
    } catch (error) {
      console.error('Error fetching data from API', error);
    }
  };

  const handleSearch = (searchTerm) => {
    fetchData();
    // Implement your search logic and update the filtered data in the state
    const filteredResults = originalData.filter(
      (row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.organization.toLowerCase().includes(searchTerm.toLowerCase()) || 
        row.google_scholar_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        row.interest.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  return (

    <div>
        <h1>Presenter Management</h1>
        <SearchComponent onSearch={handleSearch} />
        <PresenterTableComponent data={filteredData.length > 0 ? filteredData : originalData} refreshTable={fetchData}/>
        <AddPresenterComponent refreshTable={fetchData}/>
    </div>
  );
}

export default Presenter;