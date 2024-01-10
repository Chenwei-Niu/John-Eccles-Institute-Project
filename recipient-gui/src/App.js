import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import TableComponent from './components/TableComponent';
import SearchComponent from './components/SearchComponent';
function App() {
  const [originalData, setOriginalData] = useState([
    { id: 1, email: 'user1@example.com', organization: 'Org A' },
    { id: 2, email: 'user2@example.com', organization: 'Org B' },
    // ... more data
  ]);

  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (searchTerm) => {
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
        <TableComponent data={filteredData.length > 0 ? filteredData : originalData} />
      </div>
    </div>
  );
}

export default App;
