import React, { useEffect, useState } from 'react';
import TableComponent from './TableComponent';
import SearchComponent from '../SearchComponent';
import AddRecipientComponent from './AddRecipientComponent';
import FetchInterestsButton from './FetchInterestsComponent';
import EmailFunctionComponent from './EmailFunctionComponent';
import BulkAddRecipientComponent from './BulkAddRecipientComponent';
import axios from 'axios';

function Recipient() {
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
        row.organization.toLowerCase().includes(searchTerm.toLowerCase()) || 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        row.interest.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  return (

    <div>
        <h1>Recipient Management</h1>
        <SearchComponent onSearch={handleSearch} />
        <TableComponent data={filteredData.length > 0 ? filteredData : originalData} refreshTable={fetchData}/>
        <AddRecipientComponent refreshTable={fetchData}/>
        <FetchInterestsButton refreshTable={fetchData}/>
        <EmailFunctionComponent />
        <BulkAddRecipientComponent />
    </div>

  );
}

export default Recipient;