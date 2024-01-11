import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import TableComponent from './components/TableComponent';
import SearchComponent from './components/SearchComponent';
import AddRecipientComponent from './components/AddRecipientComponent';
import axios from 'axios';

function App() {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(()=>{
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users/data');
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
        row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.organization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  return (
    <div className="App">
      <div>
        <h1>Recipient Management</h1>
        <SearchComponent onSearch={handleSearch} />
        <TableComponent data={filteredData.length > 0 ? filteredData : originalData} refreshTable={fetchData}/>
        <AddRecipientComponent refreshTable={fetchData}/>
      </div>
    </div>
  );
}

export default App;
