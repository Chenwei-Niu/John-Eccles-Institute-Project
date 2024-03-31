import React, { useMemo, useState } from 'react';
import axios from 'axios';
import FileReader from 'react-file-reader';
import { useTable } from 'react-table';

const BulkAddRecipientComponent = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [failedRecords, setFailedRecords] = useState([]);
    const [dataReceived, setDataReceived] = useState(false);

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        // Send File to the server
        axios.post('http://localhost:3001/users/bulk-add', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            // const data = response.json();
            setDataReceived(true);
            setFailedRecords(response.data.failedRecords);
            console.log('Read records from the file:', response.data);
        })
        .catch(error => {
            console.error('File Upload Failed:', error);
        });
    };

    // handle file selection
    const handleFileChange = (files) => {
        setSelectedFile(files[0]);
    };

    const columns = useMemo(
        () => [
        {
            Header: 'Name',
            accessor: 'name'
        },
        {
            Header: 'Email',
            accessor: 'email'
        },
        {
            Header: 'Organization',
            accessor: 'organization'
        },
        {
            Header: 'Interests',
            accessor: 'interest'
        }
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data: failedRecords });

    return (
    <div>
        <div>
            <h3 style={{display: 'inline-block'}}>Add recipients in bulk</h3>
            <div style={{display: 'inline-block', marginLeft: '15px'}}>
                <FileReader
                fileTypes={'.xlsx'} // Accepted file
                handleFiles={handleFileChange}
                
                >
                <button>Choose xlsx file</button>
                </FileReader>

                
            </div>
            <button style={{display: 'inline-block'}} onClick={handleFileUpload}>Upload</button>
            {selectedFile ? (
                    <p style={{marginBlock : '0em', color:'red',fontWeight:'bold'}}>Selected File: {selectedFile.name}</p>
            ): (<p></p>)}
        </div>
        { dataReceived &&
            <div>
                {failedRecords.length === 0 ? (
                    <h3>All recipients are successfully inserted</h3>
                ) : (
                    // <div>
                    // <h3>Recipients are inserted except these:</h3>
                    // <ul>
                    //     {failedRecords.map((record, index) => (
                    //     <li key={index}>
                    //         Name: {record.name} &nbsp; Email: {record.email} &nbsp; Org: {record.organization}  &nbsp; Interests: {record.interest}

                    //     </li>
                    //     ))}
                    // </ul>
                    // </div>
                    <div>
                        <h3>Recipients are inserted except these:</h3>
                        <table {...getTableProps()} style={{ border: 'solid 1px blue', width: '100%' }}>
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.map(row => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        }
      </div>
    );
};

export default BulkAddRecipientComponent;
