import React, { useEffect, useState } from 'react';
import EventTableComponent from './EventTableComponent';
import SearchComponent from '../SearchComponent';
import AddEventComponent from './AddEventComponent';
import axios from 'axios';
function Event() {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);


  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/event/data');
      setOriginalData(response.data);
      console.log(originalData);
    } catch (error) {
      console.error('Error fetching data from API', error);
    }
  };

  useEffect(()=>{
    fetchData();
  }, [])

  const handleSearch = (searchTerm) => {
    fetchData();
    // Implement your search logic and update the filtered data in the state
    const filteredResults = originalData.filter(
      (row) =>
        (row.title||'').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.name||'').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (row.date||'').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (row.venue||'').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.keywords||'').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredResults);
  };


  return (

    <div>
        <h1>Event Management</h1>
        <SearchComponent onSearch={handleSearch} />
        <EventTableComponent data={filteredData.length > 0 ? filteredData : originalData} refreshTable={fetchData}/>
        <AddEventComponent refreshTable={fetchData}/>
    </div>
  );
}

export default Event;