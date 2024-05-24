import React, { useMemo, useState } from 'react';
import { useTable, useEditable } from 'react-table';
import '../../styles/TableComponent.css';
import axios from 'axios';

const TableComponent = ({data, refreshTable}) => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        organization: '',
        interest: '',
    });
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }; 
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleFocus = () => {
    setIsInputFocused(true);
  };
  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' , isEditable: true},
      { Header: 'Email', accessor: 'email' , isEditable: true},
      { Header: 'Organization', accessor: 'organization' , isEditable: true},
      {
        Header: 'Interests',
        accessor: 'interest',
        isEditable: true,
        Cell: ({ row }) => (
          <div>
            {Array.isArray(row.original.interest)
              ? row.original.interest.join(', ')
              : row.original.interest}
          </div>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <button onClick={() => handleDelete(row.original.id)}>Delete</button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useEditable);

  const handleRowClick = (row) => {
    // Handling row click events
    setSelectedRow(row.id === selectedRow ? null : row.id);
    setFormData({
        email:row.values.email, 
        name:row.values.name, 
        organization:row.values.organization, 
        interest:row.values.interest,
    })
    console.log(row)
  };

  const handleDelete = async (id) => {
    // Handle delete button click event
    console.log('Delete button clicked for id:', id);
    // Confirmation dialog box pops up
    const isConfirmed = window.confirm('Are you sure to delete this recipient?');

    // If the user clicks confirm, the delete operation is performed
    if (isConfirmed) {
        // Execute deletion logic
        const response = await axios.post('http://localhost:3001/users/delete', {id: id});
        console.log('Deleted ', response);
        refreshTable();
    } else {
        // The user clicks Cancel without performing the deletion operation.
        console.log('Cancelled');
    }
    
  };

  const handleUpdate = async () => {
    try {
      // Verify email
      if (!formData.email) {
        alert('Email is required');
        return;
      }
      if (!isValidEmail(formData.email)){
        alert('Email is invalid, please check and try again.');
        return;
      }
      // Confirmation dialog box pops up
      const isConfirmed = window.confirm('Are you sure to update this recipient?');

      if(isConfirmed){
        // transform string array to string, ONLY FOR INTEREST
        if (Array.isArray(formData.interest)){
            formData.interest = formData.interest.join(', ')
        }
        // Send an update request to the server
        const response = await axios.post('http://localhost:3001/users/update', formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Logic to handle update success
        console.log('User updated:', response.data);
        refreshTable();
      } else {
        // The user clicks Cancel without performing the deletion operation.
        console.log('Cancelled');
    }

    } catch (error) {
      console.error('Error updating user', error);
      alert('Error updating user');
    }
  }


  return (
    <div className='table-container'>
      <table {...getTableProps()} style={{ border: '1px solid black' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} style={{ padding: '10px', borderBottom: '1px solid black' }}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        
          {rows.map((row) => {
            prepareRow(row);
            const isSelected = row.id === selectedRow;

            return (
              <React.Fragment key={row.id}>
                <tr
                  {...row.getRowProps()}
                  style={{
                    borderBottom: '1px solid black',
                    cursor: 'pointer',
                    background: isSelected ? '#f0f0f0' : 'inherit',
                  }}
                  onClick={() => {
                      if (!isInputFocused){
                          handleRowClick(row)
                      }
                      
                  }}
                >

                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} style={{ padding: '10px' }} 
                          onClick={()=> {
                          console.log(cell);
                      }}>
                      {cell.render("Cell")}
                      {/* {cell.isEditable ? (
                          <div>
                              {console.log('Cell Info:', cell)}
                          </div>
                      //   <EditableCell value={cell.value} row={row} column={cell.column} />
                      ) : (
                          cell.render('Cell')
                      )} */}
                      {isSelected && (

                              <tr>
                                  <td colSpan={columns.length}>
                                      {cell.column.Header === "Actions" ? (
                                              <button onClick={() => handleUpdate()}>Update</button>
                                          ):(
                                          <textarea name={cell.column.id} cols={cell.column.id==="interest"?50:25} rows="5" value={formData[cell.column.id]} onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur}/>
                                          )
                                      }
                                      
                                  </td>
                              </tr>

                      )}
                    </td>
                  ))}
                </tr>

              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

export default TableComponent;
